import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeCurrency } from "@/helpers/mask";
import { ItemEspelhosProps, useEspelhos } from "@/hooks/comercial/useEspelhos";
import { Eye, Trash } from "lucide-react";
import { useEffect } from "react";
import { useStoreTableEspelhos } from "../table/store-table";
import { useStoreEspelho } from "./store";

const ModalItens = () => {
  const [modalOpen, closeModal, openModalItem, openModalEspelho, qtde_itens, editQtdeItens] =
    useStoreEspelho((state) => [
      state.modalItensOpen,
      state.closeModalItens,
      state.openModalItem,
      state.openModal,
      state.qtde_itens,
      state.editQtdeItens,
    ]);

  const filters = useStoreTableEspelhos().filters;

  const { data, isLoading, isSuccess } = useEspelhos().getAllItens({ filters });
  const { mutate: deleteItem } = useEspelhos().deleteItem();

  function handleClickCancel() {
    closeModal();
  }

  useEffect(() => {
    if (isSuccess) {
      editQtdeItens(data.length);
    }
  }, [isLoading, data]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Inclusões ({qtde_itens || 0})</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && isLoading && (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}

          {modalOpen && !isLoading && (
            <Table
              className="w-full"
              divClassname="border rounded-md bg-background max-h-[40vh] scroll-thin"
            >
              <TableHeader className="bg-secondary">
                <TableRow className="text-sm">
                  <TableHead className="text-nowrap">Ações</TableHead>
                  <TableHead className="text-nowrap">Segmento</TableHead>
                  <TableHead className="text-nowrap">Descrição</TableHead>
                  <TableHead className="text-nowrap">Meta</TableHead>
                  <TableHead className="text-nowrap">Real</TableHead>
                  <TableHead className="text-nowrap">Atingido</TableHead>
                  <TableHead className="text-nowrap">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.map((item: ItemEspelhosProps, index: number) => {
                    return (
                      <TableRow key={"bonus_espelho:" + item.id + index}>
                        <TableCell className="flex gap-2 text-xs text-nowrap  uppercase">
                          {item.manual ? (
                            <>
                              <Button
                                size={"xs"}
                                onClick={() => {
                                  openModalEspelho(item.id_comissao || "");
                                  openModalItem({ id: item.id || "", type: item.tipo || "" });
                                }}
                              >
                                <Eye size={16} />
                              </Button>
                              <AlertPopUp
                                title="Deseja realmente excluir?"
                                description="Essa ação não pode ser desfeita. Este bônus será excluído definitivamente do servidor."
                                action={() => deleteItem(item.id || "")}
                              >
                                <Button size={"xs"} variant={"destructive"}>
                                  <Trash size={16} />
                                </Button>
                              </AlertPopUp>
                            </>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-nowrap  uppercase">
                          {item.segmento}
                        </TableCell>
                        <TableCell className="text-xs text-nowrap  uppercase">
                          {item.descricao}
                        </TableCell>
                        <TableCell className="text-xs text-nowrap ">{item.meta}</TableCell>
                        <TableCell className="text-xs text-nowrap ">{item.realizado}</TableCell>
                        <TableCell className="text-xs text-nowrap ">
                          {item.atingimento || "-"}
                        </TableCell>
                        <TableCell className="text-xs text-nowrap ">
                          {normalizeCurrency(item.valor)}
                        </TableCell>
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

export default ModalItens;
