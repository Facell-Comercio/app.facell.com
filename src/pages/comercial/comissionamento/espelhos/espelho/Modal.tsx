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
import { InputWithLabel } from "@/components/custom/FormInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeCurrency, normalizeDate, normalizePercentual } from "@/helpers/mask";
import {
  EspelhosProps,
  ItemEspelhosProps,
  ParametrosEspelhoProps,
  useEspelhos,
} from "@/hooks/comercial/useEspelhos";
import { List, Pen, Plus, RotateCcw, Trash } from "lucide-react";
import { useEffect } from "react";
import ButtonContestacoes from "../components/ButtonContestacoes";
import ModalContestacao from "./ModalContestacao";
import ModalContestacoes from "./ModalContestacoes";
import ModalItem from "./ModalItem";
import ModalVendasInvalidas from "./ModalVendasInvalidas";
import { useStoreEspelho } from "./store";

const ModalEspelho = () => {
  const [
    modalOpen,
    closeModal,
    isPending,
    id,
    editQtdeContestacoes,
    openModalVendasInvalidas,
    qtde_vendas_invalidas,
    openModalItem,
  ] = useStoreEspelho((state) => [
    state.modalOpen,
    state.closeModal,
    state.isPending,
    state.id,
    state.editQtdeContestacoes,
    state.openModalVendasInvalidas,
    state.qtde_vendas_invalidas,
    state.openModalItem,
  ]);

  const { data, isLoading, isSuccess } = useEspelhos().getOne(id);

  const { mutate: deleteEspelho, isSuccess: deleteEspelhoIsSuccess } =
    useEspelhos().deleteEspelho();
  const { mutate: deleteItem } = useEspelhos().deleteItem();
  const { mutate: recalcularEspelho } = useEspelhos().recalcularEspelho();
  const newDataEspelho: EspelhosProps & Record<string, any> = {} as EspelhosProps &
    Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataEspelho[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataEspelho[key] = "";
    } else {
      newDataEspelho[key] = data[key];
    }
  }

  const totalComissoes = newDataEspelho.comissoes_list?.reduce(
    (acc: number, comissao) => acc + parseFloat(comissao.valor || "0"),
    0
  );
  const totalBonus = newDataEspelho.bonus_list?.reduce(
    (acc: number, bonus) => acc + parseFloat(bonus.valor || "0"),
    0
  );

  function handleClickCancel() {
    closeModal();
  }

  useEffect(() => {
    if (isSuccess && modalOpen) {
      editQtdeContestacoes(newDataEspelho.qtdeTotalContestacoes);
    }
  }, [isLoading, modalOpen]);

  useEffect(() => {
    if (deleteEspelhoIsSuccess) {
      closeModal();
    }
  }, [deleteEspelhoIsSuccess]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Espelho: {id}</DialogTitle>
          <div className="flex gap-2 ">
            <Button
              variant={"outline"}
              className="border-destructive"
              onClick={() => openModalVendasInvalidas()}
            >
              <List size={18} className="me-2" />
              Vendas Invalidadas ({qtde_vendas_invalidas || 0})
            </Button>
            <ButtonContestacoes />
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && isLoading && (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}

          {modalOpen && !isLoading && (
            <section className="flex gap-3 flex-col">
              <span className="flex gap-3 w-full">
                <InputWithLabel
                  label="Filial"
                  value={newDataEspelho.filial || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel
                  label="Nome"
                  value={newDataEspelho.nome || ""}
                  readOnly
                  className="flex-1"
                />
              </span>
              <span className="flex gap-3 w-full">
                <InputWithLabel
                  label="Cargo"
                  value={newDataEspelho.cargo || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel
                  label="Data Inicial"
                  value={normalizeDate(newDataEspelho.data_inicial) || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel
                  label="Data Final"
                  value={normalizeDate(newDataEspelho.data_final) || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel
                  label="Proporcional"
                  value={normalizePercentual(newDataEspelho.proporcional || "0")}
                  readOnly
                  className="flex-1"
                />
              </span>
              <div className="flex flex-col gap-2 bg-slate-200 dark:bg-blue-950 p-2 rounded-md">
                <h3 className="font-semibold text-md">Parâmetros</h3>
                <Table
                  className="w-full"
                  divClassname="border rounded-md bg-background max-h-[40vh] scroll-thin"
                >
                  <TableHeader className="bg-secondary">
                    <TableRow className="text-sm">
                      <TableHead className=" text-nowrap">Descrição</TableHead>
                      <TableHead className=" text-nowrap">Meta</TableHead>
                      <TableHead className=" text-nowrap">Realizado</TableHead>
                      <TableHead className=" text-nowrap">Deflator</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newDataEspelho.parametros &&
                      newDataEspelho.parametros.map(
                        (item: ParametrosEspelhoProps, index: number) => {
                          return (
                            <TableRow key={"metas-agregadores:" + item.id + index}>
                              <TableCell className="text-xs text-nowrap  uppercase">
                                {item.descricao}
                              </TableCell>

                              <TableCell className="text-xs text-nowrap ">{item.meta}</TableCell>
                              <TableCell className="text-xs text-nowrap ">
                                {item.realizado}
                              </TableCell>
                              <TableCell className="text-xs text-nowrap ">
                                {item.deflator || "-"}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col gap-2 bg-slate-200 dark:bg-blue-950 p-2 rounded-md">
                <div className="flex justify-between">
                  <span className="flex gap-3">
                    <h3 className="font-semibold text-md">Comissões</h3>
                    <Badge variant={"info"}>{normalizeCurrency(totalComissoes)}</Badge>
                  </span>
                  <Button size={"xs"} onClick={() => openModalItem({ id: "", type: "comissao" })}>
                    <Plus className="me-2" size={18} />
                    Nova Comissão
                  </Button>
                </div>
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
                    {newDataEspelho.comissoes_list &&
                      newDataEspelho.comissoes_list.map(
                        (item: ItemEspelhosProps, index: number) => {
                          return (
                            <TableRow key={"comissao_espelho:" + item.id + index}>
                              <TableCell className="flex gap-2 text-xs text-nowrap  uppercase">
                                {item.manual ? (
                                  <>
                                    <Button
                                      size={"xs"}
                                      variant={"warning"}
                                      onClick={() =>
                                        openModalItem({ id: item.id || "", type: "comissao" })
                                      }
                                    >
                                      <Pen size={16} />
                                    </Button>
                                    <AlertPopUp
                                      title="Deseja realmente excluir?"
                                      description="Essa ação não pode ser desfeita. Esta comissão será excluída definitivamente do servidor."
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
                              <TableCell className="text-xs text-nowrap ">
                                {item.realizado}
                              </TableCell>
                              <TableCell className="text-xs text-nowrap ">
                                {item.atingimento || "-"}
                              </TableCell>
                              <TableCell className="text-xs text-nowrap ">
                                {normalizeCurrency(item.valor)}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col gap-2 bg-slate-200 dark:bg-blue-950 p-2 rounded-md">
                <div className="flex justify-between">
                  <span className="flex gap-3">
                    <h3 className="font-semibold text-md">Bônus</h3>
                    <Badge variant={"info"}>{normalizeCurrency(totalBonus)}</Badge>
                  </span>
                  <Button size={"xs"} onClick={() => openModalItem({ id: "", type: "bonus" })}>
                    <Plus className="me-2" size={18} />
                    Novo Bônus
                  </Button>
                </div>
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
                    {newDataEspelho.bonus_list &&
                      newDataEspelho.bonus_list.map((item: ItemEspelhosProps, index: number) => {
                        return (
                          <TableRow key={"bonus_espelho:" + item.id + index}>
                            <TableCell className="flex gap-2 text-xs text-nowrap  uppercase">
                              {item.manual ? (
                                <>
                                  <Button
                                    size={"xs"}
                                    variant={"warning"}
                                    onClick={() =>
                                      openModalItem({ id: item.id || "", type: "bonus" })
                                    }
                                  >
                                    <Pen size={16} />
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
              </div>
              <div className="flex flex-col gap-2 bg-slate-200 dark:bg-blue-950 p-2 rounded-md">
                <h3 className="font-semibold text-md">Total</h3>
                <span className="flex gap-3 w-full">
                  <InputWithLabel
                    label="Comissão"
                    value={normalizeCurrency(newDataEspelho.comissao)}
                    readOnly
                    className="flex-1"
                  />
                  <InputWithLabel
                    label="Bônus"
                    value={normalizeCurrency(newDataEspelho.bonus)}
                    readOnly
                    className="flex-1"
                  />
                </span>
              </div>
            </section>
          )}
          <ModalContestacoes />
          <ModalContestacao />
          <ModalVendasInvalidas />
          <ModalItem />
        </ScrollArea>
        <DialogFooter>
          <div className="flex gap-3 w-full">
            <AlertPopUp
              title="Deseja realmente esse espelho?"
              description="Essa ação não pode ser desfeita. O espelho será excluído definitivamente do servidor."
              action={() => deleteEspelho(id)}
            >
              <Button variant={"destructive"} disabled={isPending}>
                <Trash size={18} className="me-2" />
                Excluir
              </Button>
            </AlertPopUp>
            <AlertPopUp
              title="Deseja realmente esse espelho?"
              description="Essa ação não pode ser desfeita. O espelho será excluído definitivamente do servidor."
              action={() => recalcularEspelho(id)}
            >
              <Button variant={"warning"} disabled={isPending}>
                <RotateCcw size={18} className="me-2" />
                Recalcular
              </Button>
            </AlertPopUp>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEspelho;
