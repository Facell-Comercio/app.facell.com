import { FileIcon, X } from "lucide-react";
import UploadDropzone from "./UploadDropzone";
import { MediaType } from "@/types/mediaTypes";

interface FileUploadProps {
    onChange: (url?: string) => void,
    value: string,
    mediaType: MediaType,
    disabled?: boolean,
  }

export const FileUpload = ({
    onChange,
    value,
    mediaType,
    disabled,
  }: FileUploadProps) => {
    // const fileType = value?.split(".").pop();
  
    if (value && mediaType === "img") {
      return (
        <div className="relative">
          <img
            src={value}
            alt="Upload"
            className="w-full h-auto"
          />
          <button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )
    }
  
    if (value && mediaType !== "img") {
      return (
        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
          <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
          <a 
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
          >
            {value}
          </a>
          {!disabled && <button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>}
        </div>
      )
    }
  
    return (
        <UploadDropzone 
        disabled={disabled}
        mediaType={mediaType} 
        onUploadSuccess={onChange}
    />
    )
  }