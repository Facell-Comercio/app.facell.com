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
import { useEffect, useState } from "react";

interface IModalFornecedores {
    open: boolean,
    handleSelecion: (item: ItemFornecedor) => void
    onOpenChange: () => void
}

export type ItemFornecedor = {
    id: number,
    cnpj: string,
    razao: string,
    nome: string,
}

const ModalFornecedores = ({ open, handleSelecion, onOpenChange }: IModalFornecedores) => {
    
    const { data, isLoading, isError } = useQuery({
        queryKey: ['fornecedores'],
        queryFn: async () => await api.get('financeiro/fornecedores/', {params: {filter: {termo}}}),
        enabled: open,
    })
    console.log(data)

    function handleSearch(text: string) {
        setSearch(text)
    }
    function handleSelection(item: ItemFornecedor) {
        handleSelecion(item)
    }

    const [search, setSearch] = useState('')

    if (isLoading) return null;
    if (isError) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Lista de Fornecedores/Clientes</DialogTitle>
                    <DialogDescription>
                        Selecione um ao clicar no botão à direita.
                    </DialogDescription>

                    <div className="flex gap-3">
                        <Input value={search} type='search' placeholder="Buscar..." />
                        <Button onClick={handleSearch}>Procurar</Button>
                    </div>
                </DialogHeader>

                <ScrollArea className="h-72 w-full rounded-md border p-3">
                    {data?.data
                        .map((item: ItemFornecedor) => (
                            <div key={'forn:' + item.id} className="flex gap-1 items-center bg-blue-100 dark:bg-blue-700 justify-between mb-1 border rounded-md p-2">
                                <span>{item.cnpj} - {item.nome} - {item.razao}</span>
                                <Button size={"sm"} onClick={() => { handleSelection(item) }}>Selecionar</Button>
                            </div>
                        ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export default ModalFornecedores;