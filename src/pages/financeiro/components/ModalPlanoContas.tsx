import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface IModalPlanoContas {
    open: boolean,
    handleSelecion: (item: ItemPlanoContas) => void
    onOpenChange: () => void
    id_filial?: string | null
}

export type ItemPlanoContas = {
    id: string,
    codigo: string,
    descricao: string,
    tipo: string,
}

const ModalPlanoContas = ({ open, handleSelecion, onOpenChange, id_filial }: IModalPlanoContas) => {
    const [search, setSearch] = useState('')

    const queryKey = id_filial ? `plano_contas:${id_filial}` : 'plano_contas';
    const { data, isLoading, isError } = useQuery({
        queryKey: [queryKey, search],
        queryFn: async () => await api.get('financeiro/plano-contas', { params: { filters: { termo: search } } }),
        enabled: open,
    })

    function handleSelection(item: ItemPlanoContas) {
        handleSelecion(item)
    }


    if (isLoading) return null;
    if (isError) return null;


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Lista de plano de contas</DialogTitle>
                    <DialogDescription>
                        Selecione um ao clicar no botão à direita.
                    </DialogDescription>

                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." />
                </DialogHeader>

                <ScrollArea className="h-72 w-full rounded-md border p-3">
                    {data?.data
                        .map((item: ItemPlanoContas) => (
                            <div key={'plano_contas:' + item.id} className="flex gap-1 items-center bg-blue-100 dark:bg-blue-700 justify-between mb-1 border rounded-md p-2">
                                <span>{item.codigo} - {item.descricao}</span>
                                <Button size={"sm"} onClick={() => { handleSelection(item) }}>Selecionar</Button>
                            </div>
                        ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export default ModalPlanoContas;