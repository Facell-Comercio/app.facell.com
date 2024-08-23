import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { normalizeDate } from "@/helpers/mask";
import {
  ConferenciasCaixaSchema,
  useConferenciasCaixa,
} from "@/hooks/financeiro/useConferenciasCaixa";
import { formatDate, startOfDay } from "date-fns";
import { useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa6";
import FormCaixa from "./Form";
import { useStoreCaixa } from "./store";

const initialPropsCaixa: ConferenciasCaixaSchema = {
  data: "",
  data_baixa_datasys: "",
  data_conferencia: "",
  divergente: "",
  id: "",
  id_filial: "",
  id_user_conferencia: "",
  ocorrencias: "",
  saldo_anterior: "",
  saldo_atual: "",
  status: "",
  valor_cartao: "",
  valor_cartao_real: "",
  valor_dinheiro: "",
  valor_pitzi: "",
  valor_pitzi_real: "",
  valor_pix: "",
  valor_pix_banco: "",
  valor_recarga: "",
  valor_recarga_real: "",
  valor_retiradas: "",
  valor_tradein: "",
  valor_tradein_disponivel: "",
  valor_tradein_utilizado: "",
  caixa_anterior_fechado: true,
};

const ModalCaixa = () => {
  const [
    modalOpen,
    closeModal,
    id,
    disabled,
    setDisabled,
    isPending,
    setIsPending,
  ] = useStoreCaixa((state) => [
    state.modalOpen,
    state.closeModal,
    state.id,
    state.disabled,
    state.setDisabled,
    state.isPending,
    state.setIsPending,
  ]);

  const formRef = useRef(null);

  const { data, isLoading, isSuccess } = useConferenciasCaixa().getOne(id);

  const { mutate: changeStatus, isSuccess: isSuccessChangeStatus } =
    useConferenciasCaixa().changeStatus();
  const {
    mutate: importDatasys,
    isSuccess: importDatasysIsSuccess,
    isPending: importDatasysIsPending,
    isError: importDatasysIsError,
  } = useConferenciasCaixa().importDatasys();
  const {
    mutate: cruzarRelatorios,
    isSuccess: cruzarRelatoriosIsSuccess,
    isPending: cruzarRelatoriosIsPending,
    isError: cruzarRelatoriosIsError,
  } = useConferenciasCaixa().cruzarRelatorios();

  const newDataCaixa: ConferenciasCaixaSchema & Record<string, any> =
    {} as ConferenciasCaixaSchema & Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataCaixa[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataCaixa[key] = "";
    } else {
      newDataCaixa[key] = data[key];
    }
  }

  const conferir = newDataCaixa.status === "A CONFERIR";
  const conferido = newDataCaixa.status === "CONFERIDO / BAIXA PENDENTE";
  const baixadoPendente = newDataCaixa.status === "BAIXADO / PENDENTE DATASYS";
  const baixadoNoDatasys = newDataCaixa.status === "BAIXADO NO DATASYS";

  function handleClickCancel() {
    closeModal();
  }

  useEffect(() => {
    if (baixadoPendente || baixadoNoDatasys) {
      setDisabled(true);
    }
    if (conferir || conferido) {
      setDisabled(false);
    }
  }, [isSuccess, isSuccessChangeStatus, newDataCaixa.status]);

  useEffect(() => {
    if (importDatasysIsSuccess || cruzarRelatoriosIsSuccess) {
      setIsPending(false);
    }
    if (importDatasysIsError || cruzarRelatoriosIsError) {
      setIsPending(false);
    }
    if (importDatasysIsPending || cruzarRelatoriosIsPending) {
      setIsPending(true);
    }
  }, [importDatasysIsPending, cruzarRelatoriosIsPending]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-4 text-xs sm:text-base">
            {id ? (
              <>
                <span>{`Caixa: ${id}`}</span>
                {!isLoading && (
                  <>
                    <span>{`Data: ${normalizeDate(
                      newDataCaixa?.data || ""
                    )}`}</span>
                    <span>{`Filial: ${newDataCaixa.filial}`}</span>
                  </>
                )}
              </>
            ) : (
              "Nova Caixa"
            )}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormCaixa
              data={newDataCaixa.id ? newDataCaixa : initialPropsCaixa}
              formRef={formRef}
            />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
          <ScrollBar />
        </ScrollArea>
        <DialogFooter
          className={`${
            newDataCaixa.status !== "BAIXADO / PENDENTE DATASYS" &&
            "sm:justify-between"
          } flex-wrap gap-2`}
        >
          {!disabled && (
            <span className="flex gap-3 ">
              <AlertPopUp
                title={"Deseja realmente reimportar?"}
                description="Essa ação não pode ser desfeita."
                action={() => {
                  importDatasys({
                    id_filial: newDataCaixa.id_filial || "",
                    range_datas: {
                      from: startOfDay(newDataCaixa.data || ""),
                      to: startOfDay(newDataCaixa.data || ""),
                    },
                  });
                }}
              >
                <Button variant={"secondary"} size={"lg"} disabled={isPending}>
                  {importDatasysIsPending ? (
                    <span className="flex gap-2 w-full items-center justify-center">
                      <FaSpinner size={18} className="me-2 animate-spin" />{" "}
                      Reimportando...
                    </span>
                  ) : (
                    "Reimportar Datasys"
                  )}
                </Button>
              </AlertPopUp>
              <AlertPopUp
                title={
                  "Deseja realmente realizar o cruzamento com os relatórios?"
                }
                description="Essa ação não pode ser desfeita."
                action={() => {
                  cruzarRelatorios({
                    id_filial: Number(newDataCaixa.id_filial),
                    data_caixa: formatDate(
                      startOfDay(newDataCaixa.data || ""),
                      "yyyy-MM-dd"
                    ),
                  });
                }}
              >
                <Button variant={"secondary"} size={"lg"} disabled={isPending}>
                  {cruzarRelatoriosIsPending ? (
                    <span className="flex gap-2 w-full items-center justify-center">
                      <FaSpinner size={18} className="me-2 animate-spin" />{" "}
                      Cruzando C/ Relatórios...
                    </span>
                  ) : (
                    "Cruzar C/ Relatórios"
                  )}
                </Button>
              </AlertPopUp>
            </span>
          )}
          {conferir && (
            <AlertPopUp
              title={"Deseja realmente informar a conferência?"}
              description="Essa ação poderá ser desfeita ao realizar a desconfirmação de caixa."
              action={() => {
                changeStatus({ id, action: "conferir" });
              }}
            >
              <Button size={"lg"} variant={"success"} disabled={isPending}>
                Informar Conferência
              </Button>
            </AlertPopUp>
          )}
          {conferido && (
            <AlertPopUp
              title={"Deseja realmente confirmar o caixa?"}
              description="Essa ação poderá ser desfeita ao realizar a desconfirmação de caixa."
              action={() => {
                changeStatus({ id, action: "confirmar" });
              }}
            >
              <span
                className="cursor-pointer"
                title={
                  newDataCaixa.caixa_anterior_fechado
                    ? ""
                    : "Ainda não foi realizada a confirmação no caixa anterior"
                }
              >
                <Button
                  size={"lg"}
                  disabled={isPending || !newDataCaixa.caixa_anterior_fechado}
                >
                  Confirmar Caixa
                </Button>
              </span>
            </AlertPopUp>
          )}
          {baixadoPendente && (
            <AlertPopUp
              title={"Deseja realmente desconfirmar o caixa?"}
              description='Essa ação fará com que o caixa retorne para o status "A CONFERIR".'
              action={() => {
                changeStatus({ id, action: "desconfirmar" });
              }}
            >
              <Button
                size={"lg"}
                variant={"warning"}
                className="justify-self-end"
              >
                Desconfirmar Caixa
              </Button>
            </AlertPopUp>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCaixa;
