import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useState } from "react";
import { useExtratoStore } from "./context";
import { ModalPreUpload } from "@/components/custom/ModalPreUpload";
import { FaSpinner } from "react-icons/fa6";
import { useQueryClient } from "@tanstack/react-query";

const ButtonImport = () => {
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalUploadOpen, setModalUploadOpen] = useState<boolean>(false);

    const contaBancaria = useExtratoStore().contaBancaria

    const handleUpload = async (fileUrl?: string) => {
        setModalUploadOpen(false)

        if (fileUrl) {
            setIsLoading(true)
            try {
                await api.post('financeiro/conciliacao-bancaria/importar-extrato', { id_conta_bancaria: contaBancaria?.id, url_extrato: fileUrl })
                toast({
                    variant: 'success', title: 'Importação realizada!'
                })
                queryClient.invalidateQueries({
                    queryKey: ['extratos-bancarios']
                })

            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Erro na importação!',
                    // @ts-ignore
                    description: error?.response?.data?.message || 'Ocorreu um erro na requisição, tente novamente ao recarregar a página!'
                })
            } finally {
                setIsLoading(false)
            }
        }
    }
    return (<>
        <ModalPreUpload
            folderName="financeiro"
            open={modalUploadOpen}
            onOpenChange={() => setModalUploadOpen(prev => !prev)}
            title="Selecione o arquivo OFX"
            description="Lembre que esse arquivo deve corresponder à conta bancária selecionada! Caso contrário ocorrerá erro."
            mediaType="ofx"
            handleUpload={handleUpload}
        />
        <Button disabled={!contaBancaria || isLoading} onClick={() => setModalUploadOpen(true)} variant={'outline'}>
            {isLoading ? (
                <div className="flex gap-2">
                    <FaSpinner size={18} className="animate-spin"/> Importando...
                </div>
            ): (
                    "Importar Extrato"
                )

            }
        </Button>
    </>
    );
}

export default ButtonImport;