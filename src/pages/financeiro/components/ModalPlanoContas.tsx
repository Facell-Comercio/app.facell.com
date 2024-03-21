import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

type PaginationProps = {
    pageLength: number,
    pageIndex: number
}

const ModalPlanoContas = ({ open, handleSelecion, onOpenChange, id_filial }: IModalPlanoContas) => {
    const [search, setSearch] = useState<string>('')
    const [pagination, setPagination] = useState<PaginationProps>({ pageLength: 15, pageIndex: 4 })

    const queryKey = id_filial ? `plano_contas:${id_filial}` : 'plano_contas';
    const { data, isLoading, isError, refetch: refetchPlanoContas } = useQuery({
        queryKey: [queryKey, search],
        queryFn: async () => await api.get('financeiro/plano-contas', { params: { filters: { termo: search, id_filial }, pagination } }),
        enabled: open,
    })

    const pages = [...Array(Math.ceil((data?.data?.qtdeTotal || 15) / pagination.pageLength)).keys()].map(page => page + 1);
    const arrayPages = pages.filter(i => {
        if (i === 1 || i === pages.length) {
            return true
        } else if (i >= pagination.pageIndex - 2 && i <= pagination.pageIndex + 2) {
            return true
        }
        return false
    })

    async function handleSearch(text: string) {
        await new Promise((resolve) => {
            setSearch(text)
            setPagination(prev=>({...prev, pageIndex: 1}))
            resolve(true)
        })
        refetchPlanoContas()
    }
    async function handlePaginationChange(index: number) {
        await new Promise((resolve) => {
            setPagination(prev => ({ ...prev, pageIndex: index }))
            resolve(true)
        })
        refetchPlanoContas()
    }
    async function handlePaginationUp() {
        await new Promise((resolve) => {
            const newPage = ++pagination.pageIndex;
            console.log(newPage)
            setPagination(prev => ({ ...prev, pageIndex: newPage }))
            resolve(true)
        })
        refetchPlanoContas()
    }
    async function handlePaginationDown() {
        await new Promise((resolve) => {
            const newPage = --pagination.pageIndex;
            setPagination(prev => ({ ...prev, pageIndex: newPage <= 0 ? 1 : newPage }))
            resolve(true)
        })
        refetchPlanoContas()
    }

    function handleSelection(item: ItemPlanoContas) {
        handleSelecion(item)
    }

    const searchRef = useRef<HTMLInputElement | null>(null)


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

                    <div className="flex gap-3">

                        <Input ref={searchRef} type="search" placeholder="Buscar..." />
                        <Button onClick={() => handleSearch(searchRef.current?.value || "")}>Procurar</Button>
                    </div>
                </DialogHeader>

                <ScrollArea className="h-72 w-full rounded-md border p-3">
                    {data?.data?.rows
                        .map((item: ItemPlanoContas, index: number) => (
                            <div key={'plano_contas:' + item.id + index} className="flex gap-1 items-center bg-blue-100 dark:bg-blue-700 justify-between mb-1 border rounded-md p-2">
                                <span>{item.codigo} - {item.descricao}</span>
                                <Button size={"sm"} onClick={() => { handleSelection(item) }}>Selecionar</Button>
                            </div>
                        ))}
                </ScrollArea>

                <DialogFooter>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button variant={"outline"} disabled={pagination.pageIndex === 1} onClick={handlePaginationDown}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </PaginationItem>
                            {
                                arrayPages.map((i) => {
                                    return (
                                        <PaginationItem key={i}>
                                            <Button variant={i === pagination.pageIndex ? "default" : "ghost"} onClick={() => handlePaginationChange(i)}>{i}</Button>
                                        </PaginationItem>
                                    )
                                })
                            }
                            <PaginationItem>
                                <Button variant={"outline"} disabled={pagination.pageIndex === pages.length} onClick={handlePaginationUp}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    {/* <PaginationEllipsis /> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ModalPlanoContas;