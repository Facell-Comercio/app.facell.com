import AlertPopUp from "@/components/custom/AlertPopUp";
import { DataTable } from "@/components/custom/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Filter, Trash, UserPlus } from "lucide-react";
import { useState } from "react";
import { BsPeople } from "react-icons/bs";
import ModalNovoReceptorBoletos from "./ModalNovoReceptor";
import { SelectMultiFilial } from "@/components/custom/SelectFilial";

type Pagination = {
    pageIndex: number;
    pageSize: number;
}

type ReceptorBoleto = {
    id: number,
    id_filial: number,
    filial: string,
    email: string,
}

type FiltersReceptores = {
    filiais_list: string[],
    email: string,
}
export default function ModalReceptoresBoletos() {
    const [pagination, setPagination] = useState<Pagination>({ pageIndex: 0, pageSize: 15 })
    const [filters, setFilters] = useState<FiltersReceptores>({ filiais_list: [], email: '' })

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["financeiro", "controle_de_caixa", "boletos", "receptores", "list", { filters }],
        queryFn: async () => {
            const result = await api.get('/financeiro/controle-de-caixa/boletos/receptores/', { params: { filters, pagination } })
            return result.data;
        }
    })

    const handleDelete = async (id_receptor: number) => {
        try {
            if (!id_receptor) {
                throw new Error('ID Receptor não recebido!')
            }
            await api.delete(`/financeiro/controle-de-caixa/boletos/receptores`, { params: { id_receptor: id_receptor } })
            refetch()
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao tentar excluir',
                // @ts-ignore
                description: error?.response?.data?.message || error.message
            })
        }
    }

    const rows: ReceptorBoleto[] = data?.rows || []

    const columnsTable: ColumnDef<ReceptorBoleto>[] = [
        {
            accessorKey: "filial",
            header: "Filial",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            id: "action",
            header: "Ação",
            cell: (info) => {
                const id_receptor = info.row.original.id
                return <AlertPopUp
                    title="Deseja realmente excluir?"
                    action={() => handleDelete(id_receptor)}
                >
                    <Button size={'xs'} variant={'destructive'}><Trash size={16} /> Excluir</Button>
                </AlertPopUp>
            }
        },
    ];


    return (
        <Dialog>
            <DialogTrigger><Button variant={'tertiary'}><BsPeople size={18} className="me-2" /> Receptores</Button></DialogTrigger>
            <DialogContent className="max-w-[800px]">
                <DialogTitle>
                    {/* Titulo */}
                    <div className="flex gap-2 items-center">
                        <BsPeople />
                        <h3> Receptores de Boletos</h3>
                    </div>
                </DialogTitle>
                <DialogDescription></DialogDescription>

                <div className="flex justify-end">
                    <ModalNovoReceptorBoletos />
                </div>

                <div className="flex justify-between gap-2 items-end border p-2 rounded-lg">
                    {/* Filtros */}
                    <div className="flex gap-3 items-end w-full">
                        <div className="flex flex-col flex-1 gap-1">
                            <label>Filial</label>
                            <SelectMultiFilial
                                className="max-w-full w-full flex-nowrap"
                                value={filters.filiais_list || []}
                                onChange={(value) => {
                                    setFilters(state => ({ ...state, filiais_list: value }));
                                }}
                                maxCount={2}
                                isLojaTim
                                nowrap
                            />
                        </div>
                        <div className="flex flex-col flex-1 gap-1">
                            <label>Email</label>
                            <Input placeholder="Digite o email" value={filters.email} onChange={(e) => setFilters(state => ({ ...state, email: e.target.value }))} />
                        </div>
                        <Button><Filter size={18} className="me-2" /> Filtrar</Button>
                    </div>
                </div>
                
                {/* Table */}
                <DataTable
                    pagination={pagination}
                    setPagination={setPagination}
                    columns={columnsTable}
                    data={rows}
                    rowCount={data?.rowCount || 0}
                    isLoading={isLoading}
                />

            </DialogContent>
        </Dialog>
    )
}
