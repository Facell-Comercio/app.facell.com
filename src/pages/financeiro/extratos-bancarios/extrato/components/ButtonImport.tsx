import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useRef, useState } from "react";
import { useExtratoStore } from "./context";

import { FaSpinner } from "react-icons/fa6";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";

const ButtonImport = () => {
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const contaBancaria = useExtratoStore().contaBancaria
    let fileRef = useRef<null | HTMLInputElement>(null);

    const handleClickImport = () => {
        fileRef?.current?.click()
    }

    const handleUpload = async () => {
        setIsLoading(true)
        try {
            const form = new FormData();
            const file = fileRef?.current?.files && fileRef?.current?.files[0]
            if (!file) {
                return;
            }
            const id_conta_bancaria = contaBancaria?.id;
            if (!id_conta_bancaria) {
                throw new Error('Selecione a conta bancária!')
            }

            form.append('file', file);
            form.append('id_conta_bancaria', String(id_conta_bancaria))

            await api.postForm('financeiro/conciliacao-bancaria/importar-extrato', form)
            toast({
                variant: 'success', title: 'Importação realizada!'
            })
            queryClient.invalidateQueries({
                queryKey: ["financeiro", "extrato_bancario"]
            })

        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro na importação do OFX!',
                // @ts-ignore
                description: error?.response?.data?.message || 'Ocorreu um erro na requisição, tente novamente ao recarregar a página!'
            })
        } finally {
            setIsLoading(false)
            if (fileRef?.current) {
                fileRef.current.value = ''
            }
        }
    }

    return (<>
        <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} />
        <Button disabled={!contaBancaria || isLoading} onClick={handleClickImport}>
            {isLoading ? (
                <div className="flex gap-2">
                    <FaSpinner size={18} className="animate-spin" /> Importando...
                </div>
            ) : (
                <div className="flex gap-1"><Upload size={18} className="me-2"/>Importar Extrato</div>
            )

            }
        </Button>

    </>);
}

export default ButtonImport;