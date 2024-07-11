import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { MediaType } from "@/types/media-type";
import { Button } from "../ui/button";
import { FileUpload } from "./FileUpload";
import { useEffect, useState } from "react";
import { GoogleFolderName } from "./UploadDropzone";

type ModalUploadProps = {
    title?: string,
    folderName: GoogleFolderName,
    description?: string,
    open: boolean,
    onOpenChange: ()=>void,
    handleUpload: (fileUrl?:string)=>void,
    mediaType: MediaType
}

export const ModalPreUpload = ({
    handleUpload,
    folderName,
    title,
    description,
    mediaType,
    open,
    onOpenChange,
}:ModalUploadProps) => {
    const [value, setValue] = useState<string>('')
    useEffect(()=>{
        setValue('')
    },[onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title ? title : 'Selecione o arquivo'}</DialogTitle>
                </DialogHeader>
                {description && (
                    <DialogDescription>{description}</DialogDescription>
                )}
                <FileUpload
                    folderName={folderName}
                    mediaType={mediaType}
                    onChange={(fileUrl)=>{
                        setValue(fileUrl || '')
                    }}
                    value={value}
                />
                <DialogFooter>
                    <Button variant={'secondary'} onClick={onOpenChange}>Cancelar</Button>
                    <Button disabled={!value} variant={'default'} onClick={()=>handleUpload(value)}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
}