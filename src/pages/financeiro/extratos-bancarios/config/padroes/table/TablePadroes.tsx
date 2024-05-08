import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";
import { ContaBancaria } from "../../../extrato/components/context";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { FaSpinner } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export type TransacaoPadrao = {
    id: number,
    id_conta_bancaria: number,
    descricao: string,
    tipo_transacao: 'DEBIT' | 'CREDIT',
}

const TablePadroes = ({ conta }: { conta: ContaBancaria }) => {
    const initialRowEditing: TransacaoPadrao = { id: 0, descricao: '', id_conta_bancaria: 0, tipo_transacao: 'DEBIT' }
    const [rowEditing, setRowEditing] = useState<TransacaoPadrao>(initialRowEditing)

    const { data, isLoading, isError } = useQuery({
        enabled: !!conta,
        queryKey: [`extratos-padroes-${conta?.id}`],
        queryFn: () => api.get(`/financeiro/conciliacao-bancaria/transacao-padrao`, { params: { id_conta_bancaria: conta?.id } })
    })

    const handleClickEdit = (row: TransacaoPadrao) => {
        setRowEditing(row)
    }
    const handleClickCancelEdit = () => {
        setRowEditing(initialRowEditing)
    }
    const handleClickSaveEdit = () => {

        setRowEditing(initialRowEditing)
    }

    const handleDeletePadrao = (id_padrao: number) => {
        console.log(id_padrao)
    }

    if (isLoading) {
        return <div><FaSpinner size={18} className="animate-spin me-2" /> Carregando...</div>
    }

    const rows = data?.data?.rows || []

    return (
        <Table className="w-auto">
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>DESCRICAO</TableHead>
                    <TableHead>TIPO</TableHead>
                    <TableHead>AÇÃO</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row: TransacaoPadrao) => {
                    const isRowEditing = rowEditing?.id === row.id

                    return (
                        <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>
                                {isRowEditing ?
                                    <Input value={rowEditing?.descricao} onChange={(e) => setRowEditing((prev) => ({ ...prev, descricao: e.target.value }))} /> :
                                    row.descricao}
                            </TableCell>
                            <TableCell>
                                {isRowEditing ?
                                    (<Select defaultValue={rowEditing.tipo_transacao} value={rowEditing.tipo_transacao} onValueChange={(tipo_transacao: 'CREDIT' | 'DEBIT') => setRowEditing((prev) => ({ ...prev, tipo_transacao: tipo_transacao }))}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue defaultValue={rowEditing.tipo_transacao} placeholder="Selecione o Tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="DEBIT">DEBIT</SelectItem>
                                                <SelectItem value="CREDIT">CREDIT</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    ) :
                                    row.tipo_transacao}
                            </TableCell>
                            <TableCell className="flex gap-2">
                                {isRowEditing ?
                                    (
                                        <div className="flex gap-2">
                                            <Button onClick={handleClickCancelEdit} variant={'secondary'} size={'sm'}>Cancelar</Button>
                                            <Button onClick={handleClickSaveEdit} variant={'success'} size={'sm'}>Salvar</Button>
                                        </div>
                                    ) :
                                    (
                                        <Button onClick={() => handleClickEdit(row)} size={'sm'} variant={'warning'}>
                                            <Edit size={16} />
                                        </Button>
                                    )}

                                <AlertPopUp
                                    title="Deseja realmente excluir?"
                                    description={`O padrão ${row.descricao} será removido do sistema, podendo ser criado novamente.`}
                                    action={() =>
                                        handleDeletePadrao(row.id)
                                    }
                                >
                                    <Button
                                        type="button"
                                        size={'sm'}
                                        className="h-9"
                                        variant={"destructive"}
                                    >
                                        <Trash size={18} />
                                    </Button>

                                </AlertPopUp>
                            </TableCell>
                        </TableRow>
                    )
                }
                )
                }
            </TableBody>
        </Table>);
}

export default TablePadroes;