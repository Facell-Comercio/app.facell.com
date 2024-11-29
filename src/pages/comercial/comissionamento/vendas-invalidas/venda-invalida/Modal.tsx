import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

import { InputWithLabel } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { hasPermission } from "@/helpers/checkAuthorization";
import { normalizeCurrency, normalizeDate, normalizePercentual } from "@/helpers/mask";
import {
  useVendasInvalidadas,
  VendasInvalidadasProps,
} from "@/hooks/comercial/useVendasInvalidadas";
import { Divide, HandCoins, Info, OctagonAlert, PencilIcon, Plus } from "lucide-react";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa6";
import ModalContestacao from "./ModalContestacao";
import ModalRateio from "./ModalRateio";
import { useStoreVendaInvalidada } from "./store";

function colorStatus(status: string) {
  if (status === "procedente") return "bg-green-500";
  else if (status === "improcedente" || status === "ciente") return "bg-red-500";
  else return "bg-secondary";
}
const ModalVendaInvalidada = () => {
  const [
    modalOpen,
    closeModal,
    isPending,
    id,
    openModalContestacao,
    openModalRateio,
    editIsPending,
  ] = useStoreVendaInvalidada((state) => [
    state.modalOpen,
    state.closeModal,
    state.isPending,
    state.id,
    state.openModalContestacao,
    state.openModalRateio,
    state.editIsPending,
  ]);

  const { data } = useVendasInvalidadas().getOne(id);
  const {
    mutate: gerarVales,
    isPending: gerarValesIsPending,
    isSuccess: gerarValesIsSuccess,
    isError: gerarValesIsError,
  } = useVendasInvalidadas().gerarVales();
  const newDataVendaInvalidada: VendasInvalidadasProps & Record<string, any> =
    {} as VendasInvalidadasProps & Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataVendaInvalidada[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataVendaInvalidada[key] = "";
    } else {
      newDataVendaInvalidada[key] = data[key];
    }
  }

  useEffect(() => {
    if (gerarValesIsSuccess) {
      editIsPending(false);
    } else if (gerarValesIsError) {
      editIsPending(false);
    } else if (gerarValesIsPending) {
      editIsPending(true);
    }
  }, [gerarValesIsPending]);

  function handleClickCancel() {
    closeModal();
  }

  const totalRateios = newDataVendaInvalidada?.rateios?.reduce(
    (acc, rateio) => acc + parseFloat(rateio.valor || "0"),
    0
  );

  const totalPercentualRateios = newDataVendaInvalidada?.rateios?.reduce(
    (acc, rateio) => acc + parseFloat(rateio.percentual || "0"),
    0
  );

  const podeGerarVales =
    newDataVendaInvalidada?.podeGerarVales && hasPermission(["GERENCIAR_VALES", "MASTER"]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Venda invalidada: ${id}`}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <section className="flex gap-3 flex-col">
            <span
              className={`uppercase text-center rounded-md p-1 text-sm font-semibold ${colorStatus(
                newDataVendaInvalidada.status || ""
              )}`}
            >
              {newDataVendaInvalidada.status && newDataVendaInvalidada.status.replaceAll("_", " ")}
            </span>
            <div className="flex gap-2 flex-col p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
              <div className="flex justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Info />
                  <span className="text-lg font-bold ">Dados</span>
                </div>
              </div>
              <span className="flex gap-2">
                <InputWithLabel
                  value={newDataVendaInvalidada.tipo || ""}
                  label="Tipo:"
                  readOnly
                  className="flex-1 min-w-[20ch]"
                  inputClass="uppercase"
                />
                <InputWithLabel
                  value={newDataVendaInvalidada.segmento || ""}
                  label="Segmento:"
                  readOnly
                  className="flex-1 min-w-[20ch]"
                  inputClass="uppercase"
                />
                <InputWithLabel
                  value={newDataVendaInvalidada.motivo || ""}
                  label="Motivo:"
                  readOnly
                  className="flex-1 min-w-[20ch]"
                  inputClass="uppercase"
                />
              </span>
              <span className="flex gap-2">
                <InputWithLabel
                  value={normalizeCurrency(newDataVendaInvalidada.valor) || ""}
                  label="Valor:"
                  readOnly
                  className="flex-1 min-w-[20ch]"
                />
                <InputWithLabel
                  value={normalizeCurrency(newDataVendaInvalidada.estorno) || ""}
                  label="Total:"
                  readOnly
                  className="flex-1 min-w-[20ch]"
                />
                <InputWithLabel
                  value={normalizeDate(newDataVendaInvalidada.data_venda) || ""}
                  label="Data Venda:"
                  readOnly
                  className="flex-1 min-w-[20ch]"
                />
              </span>
              <span className="flex gap-2">
                <InputWithLabel
                  value={newDataVendaInvalidada.gsm || ""}
                  label="GSM:"
                  readOnly
                  className="flex-1 min-w-[20ch]"
                />
                <InputWithLabel
                  value={newDataVendaInvalidada.gsm_provisorio || ""}
                  label="GSM Provisório:"
                  readOnly
                  className="flex-1 min-w-[20ch]"
                />
                <InputWithLabel
                  value={newDataVendaInvalidada.imei || ""}
                  label="IMEI:"
                  readOnly
                  className="flex-1 min-w-[20ch]"
                />
              </span>
              <span className="flex gap-2">
                <InputWithLabel
                  value={newDataVendaInvalidada.filial || ""}
                  label="Filial:"
                  readOnly
                  className="flex-1 min-w-[20ch]"
                />
                <InputWithLabel
                  value={newDataVendaInvalidada.cpf_cliente || ""}
                  label="CPF Cliente:"
                  readOnly
                  className="flex-1 min-w-[20ch]"
                />
                <InputWithLabel
                  value={newDataVendaInvalidada.cpf_vendedor || ""}
                  label="CPF Vendedor:"
                  readOnly
                  className="flex-1 min-w-[20ch]"
                />
              </span>
              <span className="flex gap-2 flex-col">
                <label className="text-sm font-medium">Observação:</label>
                <Textarea value={newDataVendaInvalidada.observacao || "-"} readOnly />
              </span>
            </div>
            <div className="flex gap-2 flex-col p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
              <div className="flex justify-between mb-3">
                <div className="flex items-center gap-3">
                  <OctagonAlert />
                  <span className="text-lg font-bold ">Contestações</span>
                </div>
                <Button disabled={isPending} onClick={() => openModalContestacao("")}>
                  <Plus className="me-2" />
                  Nova Contestação
                </Button>
              </div>
              <Table divClassname="rounded-md">
                <TableHeader className="bg-secondary">
                  <TableRow>
                    <TableHead className="text-white">Ações</TableHead>
                    <TableHead className="text-white">Data Criação</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Obs. Gestor</TableHead>
                    <TableHead className="text-white">Obs. ADM</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-background">
                  {newDataVendaInvalidada.contestacoes &&
                    newDataVendaInvalidada.contestacoes.map((contestacao, index) => {
                      let color = "";
                      if (contestacao.status === "procedente") {
                        color = "text-green-500";
                      } else if (
                        contestacao.status === "improcedente" ||
                        contestacao.status === "ciente"
                      ) {
                        color = "text-red-500";
                      }
                      return (
                        <TableRow key={`${index} - ${contestacao.id}`} className="uppercase">
                          <TableCell className="flex gap-2">
                            <Button
                              size={"xs"}
                              variant={"warning"}
                              onClick={() => openModalContestacao(contestacao.id || "")}
                              disabled={isPending}
                            >
                              <PencilIcon size={16} />
                            </Button>
                          </TableCell>
                          <TableCell>{normalizeDate(contestacao.created_at)}</TableCell>
                          <TableCell className={`${color}`}>
                            {contestacao.status?.replaceAll("_", " ")}
                          </TableCell>
                          <TableCell>{contestacao.contestacao}</TableCell>
                          <TableCell>{contestacao.resposta || "-"}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
            <div className="flex gap-2 flex-col p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
              <div className="flex justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Divide />
                  <span className="text-lg font-bold ">Rateio</span>
                </div>
                <span className="flex gap-2">
                  {podeGerarVales && (
                    <Button
                      disabled={isPending}
                      onClick={() =>
                        gerarVales({ ref: newDataVendaInvalidada.ref || "", id_venda_invalida: id })
                      }
                      variant={"destructive"}
                    >
                      {isPending ? (
                        <FaSpinner size={18} className="me-2 animate-spin" />
                      ) : (
                        <HandCoins size={18} className="me-2" />
                      )}
                      Gerar Vales
                    </Button>
                  )}
                  <Button
                    disabled={isPending}
                    onClick={() =>
                      openModalRateio({
                        id: "",
                        valor: newDataVendaInvalidada.estorno || "",
                        filial: newDataVendaInvalidada.filial || "",
                        ref: newDataVendaInvalidada.ref || "",
                      })
                    }
                  >
                    <Plus className="me-2" />
                    Novo Rateio
                  </Button>
                </span>
              </div>
              <Table divClassname="rounded-md">
                <TableHeader className="bg-secondary">
                  <TableRow>
                    <TableHead className="text-white">Ações</TableHead>
                    <TableHead className="text-white">Nome</TableHead>
                    <TableHead className="text-white">Cargo</TableHead>
                    <TableHead className="text-white">Total</TableHead>
                    <TableHead className="text-white">Percentual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-background">
                  {newDataVendaInvalidada.rateios &&
                    newDataVendaInvalidada.rateios.map((rateio, index) => {
                      return (
                        <TableRow key={`${index} - ${rateio.id}`} className="uppercase">
                          <TableCell className="flex gap-2">
                            <Button
                              size={"xs"}
                              variant={"warning"}
                              onClick={() =>
                                openModalRateio({
                                  id: rateio.id || "",
                                  valor: newDataVendaInvalidada.estorno || "",
                                  filial: newDataVendaInvalidada.filial || "",
                                  ref: newDataVendaInvalidada.ref || "",
                                  edit: !rateio.canEdit,
                                })
                              }
                              disabled={isPending || !!rateio.canEdit}
                            >
                              <PencilIcon size={16} />
                            </Button>
                          </TableCell>
                          <TableCell>{rateio.nome_colaborador}</TableCell>
                          <TableCell>{rateio.cargo_colaborador}</TableCell>
                          <TableCell>
                            {parseFloat(rateio.valor || "0").toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              minimumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell>{normalizePercentual(rateio.percentual)}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
                <TableFooter className="bg-secondary">
                  <TableRow className="uppercase">
                    <TableCell colSpan={3}>Total :</TableCell>
                    <TableCell>
                      {totalRateios?.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      {normalizePercentual(totalPercentualRateios?.toFixed(6) || "0")}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </section>
          <ModalContestacao />
          <ModalRateio />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ModalVendaInvalidada;
