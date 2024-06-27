import { api } from "@/lib/axios";
import { MediaType } from "@/types/media-type";
import { FileIcon, X } from "lucide-react";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import AlertPopUp from "./AlertPopUp";
import UploadDropzone from "./UploadDropzone";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  mediaType: MediaType;
  disabled?: boolean;
  canDelete?: boolean;
}

type ButtonFileDeleteProps = {
  isDeleting: boolean;
  handleDelete: () => void;
};

const ButtonFileDelete = ({
  isDeleting,
  handleDelete,
}: ButtonFileDeleteProps) => {
  return (
    <AlertPopUp
      title="Deseja realmente excluir?"
      description="Essa ação não pode ser desfeita. O arquivo será excluído definitivamente do servidor, podendo ser enviado novamente."
      action={handleDelete}
    >
      <button
        className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
        type="button"
        disabled={isDeleting}
      >
        <X className={`h-4 w-4 ${isDeleting && "animate-spin"} `} />
      </button>
    </AlertPopUp>
  );
};

export const FileUpload = ({
  onChange,
  value,
  mediaType,
  disabled,
  canDelete,
}: FileUploadProps) => {
  // const fileType = value?.split(".").pop();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const canShowDeleteButton = !disabled || (canDelete !== undefined ? canDelete : false)

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/upload`, {
        data: {
          fileName: value,
        },
      });
      onChange("");
    } catch (error: Error | any) {
      toast({
        title: "Ocorreu um erro ao tentar excluir o arquivo",
        description: error?.message || "",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (value && mediaType === "img") {
    return (
      <div className="relative">
        <img src={value} alt="Upload" className="w-full h-auto rounded-lg" />

        {canShowDeleteButton && (
          <ButtonFileDelete
            isDeleting={isDeleting}
            handleDelete={handleDelete}
          />
        )}
      </div>
    );
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
        {canShowDeleteButton && (
          <ButtonFileDelete
            isDeleting={isDeleting}
            handleDelete={handleDelete}
          />
        )}
      </div>
    );
  }

  return (
    <UploadDropzone
      disabled={disabled}
      mediaType={mediaType}
      onUploadSuccess={onChange}
    />
  );
};
