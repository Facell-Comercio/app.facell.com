import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FileIcon, X } from "lucide-react";
import UploadDropzone from "./UploadDropzone";
import { MediaType } from "@/types/media-type";
import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "../ui/use-toast";

interface FileUploadProps {
  onChange: (url?: string) => void,
  value: string,
  mediaType: MediaType,
  disabled?: boolean,
}

type ButtonFileDeleteProps = {
  isDeleting: boolean
  handleDelete:()=>void
}

const ButtonFileDelete = ({isDeleting, handleDelete}: ButtonFileDeleteProps) => {
  return ( <AlertDialog>
    <AlertDialogTrigger asChild>
      <button
        className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
        type="button"
        disabled={isDeleting}
      >
        <X className={`h-4 w-4 ${isDeleting && 'animate-spin'} `} />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Deseja realmente excluir?</AlertDialogTitle>
        <AlertDialogDescription>
          Essa ação não pode ser desfeita. O arquivo será excluído definitivamente do servidor, podendo ser enviado novamente.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete}>Continuar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog> );
}
 

export const FileUpload = ({
  onChange,
  value,
  mediaType,
  disabled,
}: FileUploadProps) => {
  // const fileType = value?.split(".").pop();
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await api.delete(`/upload`, {
        data: {
          fileName: value
        }
      })
      onChange('')
    } catch (error: Error | any) {
      toast({
        title: 'Ocorreu um erro ao tentar excluir o arquivo',
        description: error?.message || '',
      })
    }finally{
      setIsDeleting(false)
    }
  }

  if (value && mediaType === "img") {
    return (
      <div className="relative">
        <img
          src={value}
          alt="Upload"
          className="w-full h-auto rounded-lg"
        />

        {!disabled && <ButtonFileDelete isDeleting={isDeleting} handleDelete={handleDelete}/>}
      </div>
    )
  }

  if (value && mediaType !== "img") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-2 items-center text-nowrap truncate text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          <FileIcon className="shrink-0 h-6 w-6 fill-indigo-200 stroke-indigo-400" />
          {value}
        </a>
        {!disabled && <ButtonFileDelete isDeleting={isDeleting} handleDelete={handleDelete}/>}
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