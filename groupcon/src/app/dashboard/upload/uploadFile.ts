import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/lib/supabase/createClient/server';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to use formidable
  },
};

export default async function uploadHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'File upload error', details: err.message });
    }

    const file = files.file as formidable.File;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    try {
      const supabase = await createClient();

      // Generate a unique filename
      const fileExtension = file.originalFilename?.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const fileContent = fs.readFileSync(file.filepath);

      // Upload the file to Supabase Storage (private bucket)
      const { data, error } = await supabase.storage
        .from('private_uploads') // Use your private bucket name
        .upload(`protected/${fileName}`, fileContent, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.mimetype || 'application/octet-stream',
        });

      if (error) {
        throw error;
      }

      res.status(200).json({
        message: 'File uploaded successfully',
        filePath: data.path,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'File upload failed', details: error.message });
    }
  });
}
