import { createClient } from '@/lib/supabase/createClient/server';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function generateSignedUrl(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filePath } = req.query;

  if (!filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from('private_uploads') // Your bucket name
      .createSignedUrl(filePath as string, 60 * 60); // Expires in 1 hour

    if (error) {
      throw error;
    }

    res.status(200).json({ signedUrl: data.signedUrl });
  } catch (error) {
    console.error(error);

    // Type guard for error
    if (error instanceof Error) {
      res.status(500).json({ error: 'Failed to generate signed URL', details: error.message });
    } else {
      res.status(500).json({ error: 'Failed to generate signed URL', details: 'Unknown error' });
    }
  }
}
