import AlertPopUp from "@/components/custom/AlertPopUp";
import { DataTable } from "@/components/custom/DataTable";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import ModalFiliais from "@/pages/admin/components/ModalFiliais";
import { Filial } from "@/types/filial-type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, PaginationDefaultOptions, PaginationOptions } from "@tanstack/react-table";
import { Filter, Save, Trash, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { BsPeople } from "react-icons/bs";

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
    filial: string,
    email: string,
}
export default function ModalNovoReceptorBoletos() {
    const queryClient = useQueryClient();

    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [modalFiliaisOpen, setModalFiliaisOpen] = useState<boolean>(false)
    const [filialSelecionada, setFilialSelecionada] = useState<Filial | null>(null)
    const [email, setEmail] = useState<string>('')

    const handleSelectionFilial = (filial: Filial)=>{
        setFilialSelecionada(filial)
    }

    const handleInsert = async () => {
        try {
            if (!filialSelecionada) {
                throw new Error('Filial não selecionada!')
            }
            if (!email) {
                throw new Error('Email não recebido!')
            }
            await api.post(`/financeiro/controle-de-caixa/boletos/receptores`, { id_filial: filialSelecionada.id, email })
            queryClient.invalidateQueries({ queryKey: ["financeiro", "controle_de_caixa", "boletos", "receptores"] })
            setModalOpen(false)
            toast({
                variant: 'success', title: 'Sucesso!'
            })
            setFilialSelecionada(null)
            setEmail('')
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro ao tentar adicionar',
                // @ts-ignore
                description: error?.response?.data?.message || error.message
            })
        }
    }

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger><Button><UserPlus size={18} className="me-2" /> Adicionar</Button></DialogTrigger>
            <DialogContent className="max-w-[700px]">
                <DialogTitle>
                    {/* Titulo */}
                    <div className="flex gap-2 items-center">
                        <UserPlus />
                        <h3> Adicionar Receptor de Boletos</h3>
                    </div>
                </DialogTitle>
                <DialogDescription></DialogDescription>

                <ModalFiliais 
                    open={modalFiliaisOpen}
                    onOpenChange={setModalFiliaisOpen}
                    handleSelection={handleSelectionFilial}
                    closeOnSelection={true}
                />
                <div className="flex gap-2 items-end">

                    <div className="flex gap-3 items-end w-full">
                        <div className="flex flex-col gap-1 w-full">
                            <label>Filial</label>
                            <Input 
                                placeholder="Selecione a filial" 
                                readOnly 
                                onClick={()=>setModalFiliaisOpen(true)} 
                                value={filialSelecionada?.nome || ''}
                            />
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <label>Email</label>
                            <Input placeholder="Digite o email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                        </div>
                    </div>


                </div>

                <div className="flex gap-3 justify-end">

                    <DialogClose>
                        <Button variant={'secondary'}><Save size={18} className="me-2" /> Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleInsert}><Save size={18} className="me-2" /> Salvar</Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}
