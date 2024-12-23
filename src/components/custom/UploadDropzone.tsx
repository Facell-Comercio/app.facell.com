import { useDropzone } from 'react-dropzone'
import { api } from '@/lib/axios';
import { File } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { MediaType } from '@/types/media-type';
import { DotsLoading } from './Loading';

export type GoogleFolderName = 'financeiro' | 'logistica' | 'pessoal' | 'comercial'
type UploadDropzoneProps = {
    disabled?: boolean,
    folderName: GoogleFolderName,
    onUploadSuccess: (fileUrl?: string) => void,
    mediaType: MediaType
}
type Accept = Record<string, string[]>
const maxFileSize = 10 * 1024 * 1024

const generateAcceptObject = (mediaType: MediaType): Accept => {
    switch (mediaType) {
        case 'img':
            return {
                'image/*': ['.png', '.jpg', '.svg', '.webp', '.jpeg', '.gif']
            };
        case 'pdf':
            return {
                'application/pdf': ['.pdf']
            };
        case 'video':
            return {
                'video/*': ['.mp4', '.avi', '.mkv', '.mov']
            };
        case 'audio':
            return {
                'audio/*': ['.mp3', '.wav', '.ogg', '.aac']
            };
        case 'excel':
            return {
                'application/vnd.ms-excel': ['.xls', '.xlsx'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
            };
        case 'txt':
            return {
                'text/plain': ['.txt']
            };
        case 'csv':
            return {
                'text/csv': ['.csv']
            };
        case 'xml':
            return {
                'application/xml': ['.xml']
            };
        case 'ofx':
            return {
                'application/x-ofx': ['.ofx']
            };
        case 'remessa':
            return {
                'text/plain': ['.txt', '.ret', '.rem'],

            };
        default:
            return {};
    }
};

const UploadDropzone = ({
    disabled,
    folderName,
    mediaType = 'etc',
    onUploadSuccess,
}: UploadDropzoneProps) => {
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    var accept: Accept = generateAcceptObject(mediaType)
    const handleUpload = useCallback(async (acceptedFiles: File[]): Promise<void> => {

        if (!acceptedFiles || acceptedFiles?.length === 0) {
            return
        }
        try {
            setIsLoading(true)
            const result = await api.postForm('storage/pre-upload', {
                file: acceptedFiles[0],
                folderName
            })
            const fileUrl = result?.data?.fileUrl;
            if (fileUrl) {
                onUploadSuccess(fileUrl)
            } else {
                throw new Error('Falha no upload, nome do arquivo no servidor não recebido!')
            }

        } catch (error: any) {
            setUploadError(error.message)
        } finally {
            setIsLoading(false)
        }

    }, [onUploadSuccess]);

    const { getRootProps, getInputProps, fileRejections } =
        useDropzone({
            disabled: disabled || isLoading,
            maxFiles: 1,
            maxSize: maxFileSize,
            accept: accept,
            onDrop: handleUpload
        });

    useEffect(() => {
        const erros = fileRejections && fileRejections[0] && fileRejections[0].errors;
        if (erros) {
            const messagesErro = erros.map(e => {
                if (e.code === 'file-too-large') {
                    return 'Arquivo maior que o limite de 10mb.'
                }
            }).join(', ');
            setUploadError(messagesErro);
        } else {
            setUploadError(null);
        }
    }, [fileRejections]);

    return (
        <div className="">
            <div
                {...getRootProps({ className: 'dropzone' })}
                className={`flex gap-2 items-center p-3 border-2 border-blue-500 rounded-md border-dashed 
                ${disabled || isLoading ? ' text-slate-700 border-slate-700 bg-slate-300 dark:bg-slate-800' : 'cursor-pointer text-blue-400 hover:border-blue-400'}  
                `}
            >   {
                    isLoading ? <div className='w-full'><DotsLoading qtde={5} /></div> : <>
                        <input {...getInputProps()} />
                        <File className='shrink-0' /> <span className='truncate'>Selecione um arquivo ou solte-o na área marcada.</span>
                    </>
                }
            </div>
            {uploadError && <p className='text-red-500'>{uploadError}</p>}
        </div>
    );
}

export default UploadDropzone;