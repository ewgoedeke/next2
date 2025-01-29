import { createClient } from '@/lib/supabase/createClient/client'
import { v4 as uuidv4 } from "uuid";

function getStorage() {
  const { storage } = createClient();
  return storage;
}

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
};
export const uploadFile = async ({ file, bucket, folder }: UploadProps) => {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;

  const storage = getStorage();

  console.log(` file: ${file} bucket: ${bucket}`)
  console.log(` folder: ${folder}`)
  console.log(` path: ${path}`)
  console.log(storage)

  const { data, error } = await storage.from(bucket).upload(path, file);

  if (error) {
    return { fileURL: "", error: "File upload failed" };
  }

  const fileURL = `${process.env
    .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${
    data?.path
  }`;

  console.log(` fileURL: ${fileURL}`)

  return { fileURL, error: "" };
};

export const deleteFile = async (fileURL: string) => {
  const bucketAndPathString = fileURL.split("/storage/v1/object/public/")[1];
  const firstSlashIndex = bucketAndPathString.indexOf("/");

  const bucket = bucketAndPathString.slice(0, firstSlashIndex);
  const path = bucketAndPathString.slice(firstSlashIndex + 1);

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).remove([path]);

  return { data, error };
};