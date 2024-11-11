import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { ContaBancaria } from "../../../extrato/components/context";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export type TransacaoPadrao = {
  id: number;
  id_conta_bancaria: number;
  descricao: string;
  tipo_transacao: "DEBIT" | "CREDIT";
};

const TablePadroes = ({ conta }: { conta: ContaBancaria | null }) => {
  const queryClient = useQueryClient();

  const initialRowEditing: TransacaoPadrao = {
    id: 0,
    descricao: "",
    id_conta_bancaria: 0,
    tipo_transacao: "DEBIT",
  };
  const [rowEditing, setRowEditing] = useState<TransacaoPadrao>(initialRowEditing);

  const { data, isLoading } = useQuery({
    enabled: !!conta,
    queryKey: ["financeiro", "conciliacao", "transacao_nao_conciliavel", "lista", conta?.id],
    queryFn: async () =>
      await api.get(`/financeiro/conciliacao-bancaria/transacao-padrao`, {
        params: {
          id_conta_bancaria: conta?.id,
        },
      }),
  });

  const handleClickEdit = (row: TransacaoPadrao) => {
    setRowEditing(row);
  };
  const handleClickCancelEdit = () => {
    setRowEditing(initialRowEditing);
  };
  const [saving, setSaving] = useState<boolean>(false);

  const handleClickSaveEdit = async () => {
    try {
      if (!conta?.id) {
        throw new Error("Selecione a conta bancária!");
      }
      if (!rowEditing?.id) {
        throw new Error("ID do padrão não identificado! Atualize a página");
      }
      if (!rowEditing?.descricao || rowEditing?.descricao?.length < 1) {
        throw new Error("Preencha a descrição! No mínimo 1 caracter");
      }
      if (!rowEditing?.tipo_transacao || rowEditing?.tipo_transacao?.length < 1) {
        throw new Error("Preencha o Tipo de transação! DEBIT ou CREDIT");
      }

      setSaving(true);
      await api.put("/financeiro/conciliacao-bancaria/transacao-padrao", {
        id_padrao: rowEditing.id,
        descricao: rowEditing.descricao,
        tipo_transacao: rowEditing.tipo_transacao,
        id_conta_bancaria: conta?.id,
      });

      queryClient.invalidateQueries({
        queryKey: ["financeiro", "conciliacao", "transacao_nao_conciliavel"],
      });
      setRowEditing(initialRowEditing);
    } catch (error) {
      toast({
        title: "Erro ao tentar salvar o padrão",
        variant: "destructive",
        description:
          // @ts-ignore
          error?.response?.data?.message || "Tente novamente ao atualizar a página.",
      });
    } finally {
      setSaving(false);
    }
  };

  const [deleting, setDeleting] = useState<number | null>(null);
  const handleDeletePadrao = async (id_padrao: number) => {
    try {
      setDeleting(id_padrao);
      await api.delete("/financeiro/conciliacao-bancaria/transacao-padrao", {
        params: { id_padrao: id_padrao },
      });
      queryClient.invalidateQueries({
        queryKey: ["financeiro", "conciliacao", "transacao_nao_conciliavel"],
      });
      toast({
        title: "Padrão excluído",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro ao tentar excluir o padrão",
        variant: "destructive",
        description:
          // @ts-ignore
          error?.response?.data?.message || "Tente novamente ao atualizar a página.",
      });
    } finally {
      setDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div>
        <FaSpinner size={16} className="animate-spin me-2" /> Carregando...
      </div>
    );
  }

  const rows = data?.data?.rows || [];

  return (
    <div className="rounded-md border">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="text-nowrap cursor-pointer text-xs">
            <TableHead>AÇÃO</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>DESCRICAO</TableHead>
            <TableHead>TIPO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: TransacaoPadrao) => {
            const isRowEditing = rowEditing?.id === row.id;

            return (
              <TableRow key={row.id} className="text-xs">
                <TableCell className="flex gap-2">
                  {isRowEditing ? (
                    <>
                      <Button
                        disabled={saving}
                        onClick={handleClickSaveEdit}
                        variant={"success"}
                        size={"xs"}
                        className="h-8"
                      >
                        Salvar
                      </Button>
                      <Button
                        disabled={saving}
                        onClick={handleClickCancelEdit}
                        variant={"secondary"}
                        size={"xs"}
                        className="h-8"
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleClickEdit(row)}
                      size={"xs"}
                      className="w-10"
                      variant={"warning"}
                    >
                      <Edit size={16} />
                    </Button>
                  )}

                  <AlertPopUp
                    title="Deseja realmente excluir?"
                    description={`O padrão ${row.descricao} será removido do sistema, podendo ser criado novamente.`}
                    action={() => handleDeletePadrao(row.id)}
                  >
                    <Button
                      disabled={deleting == row.id || saving}
                      type="button"
                      size={"xs"}
                      className="w-10"
                      variant={"destructive"}
                    >
                      {deleting == row.id ? (
                        <FaSpinner size={16} className="animate-spin" />
                      ) : (
                        <Trash size={16} />
                      )}
                    </Button>
                  </AlertPopUp>
                </TableCell>
                <TableCell className="p-2">{row.id}</TableCell>
                <TableCell className="p-2">
                  {isRowEditing ? (
                    <Input
                      value={rowEditing?.descricao}
                      onChange={(e) =>
                        setRowEditing((prev) => ({
                          ...prev,
                          descricao: e.target.value,
                        }))
                      }
                      className="h-8"
                    />
                  ) : (
                    row.descricao
                  )}
                </TableCell>
                <TableCell className="p-2">
                  {isRowEditing ? (
                    <Select
                      defaultValue={rowEditing.tipo_transacao}
                      value={rowEditing.tipo_transacao}
                      onValueChange={(tipo_transacao: "CREDIT" | "DEBIT") =>
                        setRowEditing((prev) => ({
                          ...prev,
                          tipo_transacao: tipo_transacao,
                        }))
                      }
                    >
                      <SelectTrigger className="w-[180px] h-8">
                        <SelectValue
                          defaultValue={rowEditing.tipo_transacao}
                          placeholder="Selecione o Tipo"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="DEBIT">DEBIT</SelectItem>
                          <SelectItem value="CREDIT">CREDIT</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    row.tipo_transacao
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TablePadroes;
