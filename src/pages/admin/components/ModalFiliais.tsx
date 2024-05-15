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
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Filial } from "@/types/filial-type";
import { useFilial } from "@/hooks/useFilial";


interface IModalFiliais {
    open: boolean,
    handleSelection: (item: Filial) => void
    onOpenChange: () => void
    closeOnSelection?: boolean
}

type PaginationProps = {
    pageSize: number,
    pageIndex: number
}

const ModalFiliais = ({ open, handleSelection, onOpenChange, closeOnSelection }: IModalFiliais) => {
    const [search, setSearch] = useState<string>('')
    const [pagination, setPagination] = useState<PaginationProps>({ pageSize: 15, pageIndex: 0 })

    const { data, isLoading, isError } = useFilial().getAll({pagination, filters: {termo: search}})
    const pages = [...Array(data?.data?.pageCount || 0).keys()].map(page => page + 1);
    const arrayPages = pages.filter(i => {
        if (i === 1 || i === pages.length) {
            return true
        } else if (i >= pagination.pageIndex - 2 && i <= pagination.pageIndex + 2) {
            return true
        }
        return false
    })

    async function handleSearch() {
        await new Promise((resolve) => {
            setSearch(searchRef.current?.value || "")
            setPagination(prev=>({...prev, pageIndex: 0}))
            resolve(true)
        })
    }
    async function handlePaginationChange(index: number) {
        await new Promise((resolve) => {
            setPagination(prev => ({ ...prev, pageIndex: index }))
            resolve(true)
        })
    }
    async function handlePaginationUp() {
        await new Promise((resolve) => {
            const newPage = ++pagination.pageIndex;
            console.log(newPage)
            setPagination(prev => ({ ...prev, pageIndex: newPage }))
            resolve(true)
        })
    }
    async function handlePaginationDown() {
        await new Promise((resolve) => {
            const newPage = --pagination.pageIndex;
            setPagination(prev => ({ ...prev, pageIndex: newPage <= 0 ? 0 : newPage }))
            resolve(true)
        })
    }

    function pushSelection(item: Filial) {
        if(closeOnSelection){
            // @ts-ignore 'vai funcionar...'
            onOpenChange(prev=>!prev)
        }
        handleSelection(item)
    }

    const searchRef = useRef<HTMLInputElement | null>(null)


    if (isLoading) return null;
    if (isError) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle>Lista de filiais</DialogTitle>
                    <DialogDescription>
                        Selecione uma ao clicar no botão à direita.
                    </DialogDescription>

                    <div className="flex gap-3">

                        <Input ref={searchRef} type="search" placeholder="Buscar..." onKeyDown={(e)=>{if(e.key === 'Enter'){handleSearch()}}} />
                        <Button onClick={() => handleSearch()}>Procurar</Button>
                    </div>
                </DialogHeader>

                <ScrollArea className="h-72 w-full rounded-md border p-3">
                    {data?.data?.rows
                        .map((item: Filial) => (
                            <div key={`filial.${item.id}`} className="flex gap-1 items-center bg-blue-100 dark:bg-blue-700 justify-between mb-1 border rounded-md p-2">
                                <span>{item?.grupo_economico}</span>
                                <span>{item.nome}</span>
                                <Button size={"sm"} onClick={() => { pushSelection(item) }}>Selecionar</Button>
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
                                            <Button variant={i-1 === pagination.pageIndex ? "default" : "ghost"} onClick={() => handlePaginationChange(i-1)}>{i}</Button>
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

export default ModalFiliais;