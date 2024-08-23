import { Spinner } from "@/components/custom/Spinner";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { File, ImportIcon } from "lucide-react";
import { useRef, useState } from "react";

type ImportacaoItemProps = {
    label: string;
    uri: string;
    icon?: React.ReactNode;
}
const ImportacaoItem = ({ icon = <File/>, label, uri, }: ImportacaoItemProps) => {
    const queryClient = useQueryClient();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null)
    const handleChangeFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const files = event.target.files;
            if (!files || files.length == 0) {
                return;
            }
            setIsLoading(true)
            const form = new FormData();
            form.append('file', files[0])
            await api.post('/financeiro/controle-de-caixa/importacoes/' + uri, form)
            queryClient.invalidateQueries({queryKey: ['root', 'log_import_relatorio']})
            toast({
                variant: 'success', title: 'Relatório importado com sucesso!',
            })
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Ops!',
                // @ts-ignore
                description: error?.response?.data?.message || error?.message
            })
        } finally {
            setIsLoading(false)
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    }
    const handleClickImportar = ()=>{
        if(isLoading) return;
        inputRef?.current?.click()
    }

    return (
        <AccordionItem value={label} className="border rounded-lg overflow-hidden no-underline">
            <AccordionTrigger className="hover:bg-secondary px-2 hover:no-underline"><div className="flex gap-2">{icon && icon}{label}</div></AccordionTrigger>
            <AccordionContent>
                <div className="flex p-2 gap-3">
                    <Input ref={inputRef} onChange={handleChangeFile} type="file" className="hidden" />
                    <Button onClick={handleClickImportar} disabled={isLoading} >{isLoading? <span className="flex gap-2"><Spinner/> Importando</span> : <span className="flex gap-2 items-center"><ImportIcon size={18}/> Importar</span>}</Button>
                </div>
            </AccordionContent>
        </AccordionItem>);
}

export default ImportacaoItem;