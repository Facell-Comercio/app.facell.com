import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { hasPermission } from "@/helpers/checkAuthorization";
import { normalizeDate } from "@/helpers/mask";
import { ContestacaoEspelhosProps, useEspelhos } from "@/hooks/comercial/useEspelhos";
import { Eye, PencilIcon, Plus } from "lucide-react";
import { useStoreTableEspelhos } from "../table/store-table";
import { useStoreEspelho } from "./store";

const ModalContestacoes = () => {
  const [
    modalOpen,
    closeModal,
    openModalContestacao,
    isPending,
    modalEspelhosOpen,
    openModal,
    id_comissao,
    qtde_contestacoes,
  ] = useStoreEspelho((state) => [
    state.modalContestacoesOpen,
    state.closeModalContestacoes,
    state.openModalContestacao,
    state.isPending,

    state.modalOpen,
    state.openModal,
    state.id,
    state.qtde_contestacoes,
  ]);
  const filters = useStoreTableEspelhos().filters;

  const { data, isLoading } = useEspelhos().getAllContestacoes({ id_comissao, filters });

  function handleClickCancel() {
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Contestações de Cálculo ({qtde_contestacoes || 0})</DialogTitle>
          {hasPermission(["MASTER", "COMISSOES:ESPELHOS_GERAR"]) && (
            <Button disabled={isPending} onClick={() => openModalContestacao("")} size={"sm"}>
              <Plus className="me-2" size={18} />
              Nova Contestação
            </Button>
          )}
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && isLoading && (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}

          {modalOpen && !isLoading && (
            <Table className="w-full" divClassname="border rounded-md max-h-[40vh] scroll-thin">
              <TableHeader className="bg-secondary">
                <TableRow className="text-sm">
                  {hasPermission([
                    "MASTER",
                    "COMISSOES:ESPELHOS_EDITAR",
                    "COMISSOES:ESPELHOS_CONTESTAR",
                  ]) && <TableHead className=" text-nowrap">Ação</TableHead>}
                  <TableHead className=" text-nowrap">Data Criação</TableHead>
                  <TableHead className=" text-nowrap">Status</TableHead>
                  <TableHead className=" text-nowrap">Obs. Gestor</TableHead>
                  <TableHead className=" text-nowrap">Obs. ADM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.map((item: ContestacaoEspelhosProps, index: number) => {
                    let color = "";
                    if (item.status === "procedente") {
                      color = "text-green-500";
                    } else if (item.status === "improcedente" || item.status === "ciente") {
                      color = "text-red-500";
                    }
                    return (
                      <TableRow
                        key={`${index} - ${item.id}`}
                        className="uppercase odd:bg-secondary/60 even:bg-secondary/40"
                      >
                        {hasPermission([
                          "MASTER",
                          "COMISSOES:ESPELHOS_EDITAR",
                          "COMISSOES:ESPELHOS_CONTESTAR",
                        ]) && (
                          <TableCell className="flex gap-2">
                            {!modalEspelhosOpen && (
                              <Button
                                size={"xs"}
                                onClick={() => {
                                  openModal(item.id_comissao || "");
                                  closeModal();
                                }}
                                disabled={isPending}
                                title="Ver espelho"
                              >
                                <Eye size={16} />
                              </Button>
                            )}
                            <Button
                              size={"xs"}
                              variant={"warning"}
                              onClick={() => openModalContestacao(item.id || "")}
                              disabled={isPending}
                              title="Editar contestação"
                            >
                              <PencilIcon size={16} />
                            </Button>
                          </TableCell>
                        )}
                        <TableCell>{normalizeDate(item.created_at || "")}</TableCell>
                        <TableCell className={`${color}`}>
                          {item.status === "em_analise" ? "EM ANÁLISE" : item.status}
                        </TableCell>
                        <TableCell>{item.contestacao}</TableCell>
                        <TableCell>{item.resposta || "-"}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
        <DialogFooter className="hidden"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalContestacoes;
