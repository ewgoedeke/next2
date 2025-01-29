"use client"

import {ChangeEvent, useRef, useState, useTransition, useEffect} from 'react';
import {uploadFile} from '@/lib/supabase/storage/client'
import {convertBlobUrlToFile} from '@/lib/utils'
import { getUserId } from '@/lib/actions/actions'
import { createClient } from '@/lib/supabase/createClient/client'



function FileUpload() {

    // const userId = getUserId()
    const supabase = createClient()

    const [userId, setUserId] = useState<string>(""); // Initialize as an empty string

    useEffect(() => {
      // Fetch the user ID asynchronously
      const fetchUserId = async () => {
        try {
          const id = await getUserId(); // Assume getUserId is an async function
          if (id) setUserId(id); // Update state only if id is defined
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      };
  
      fetchUserId();
    }, []); 

    console.log("********************************", userId)

    const [fileURLs, setFileURLs] = useState<string[]>([])

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            const newFileURLs = filesArray.map((file) => URL.createObjectURL(file))

            setFileURLs([...fileURLs, ...newFileURLs])
        }
    }

    const [isPending, startTransition] = useTransition()

    const handleClickUploadImageButton = () => {
        startTransition(async () => {
          let urls = [];
          for (const url of fileURLs) {
            const file = await convertBlobUrlToFile(url);
      
            const { fileURL, error } = await uploadFile({
              file: file,
              bucket: "uploads",
            });
      
            if (error) {
              console.error(error);
              return;
            }
      
            // Insert only the fileurl into the new table
            const { error: dbError } = await supabase.from("file_uploads").insert({
              fileurl: fileURL,
              user_id: userId, 
            });
      
            if (dbError) {
              console.error("Error inserting into the database:", dbError.message);
              return;
            }
      
            urls.push(fileURL);
          }
      
          console.log(urls);
          setFileURLs([]);
        });
      };
      
      
      


  return (
    <div className="flex space-x-4">
      <input 
        type='file'
        hidden
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isPending}
      />

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}>
        Select files
      </button>

      <div className="w-full mt-4">
        <h2 className="text-lg font-bold mb-2">Selected Files:</h2>
        <ul className="list-disc list-inside">
          {fileURLs.length > 0 ? (
            fileURLs.map((name, index) => (
              <li key={index} className="text-gray-800">
                {name}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No files selected.</p>
          )}
        </ul>
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        onClick={handleClickUploadImageButton}
        disabled={isPending}>
          {isPending ? 'uploading ...' : 'upload files'}
      </button>

    </div>
  )
}

export default FileUpload