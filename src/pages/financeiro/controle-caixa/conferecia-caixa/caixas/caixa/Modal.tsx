import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { normalizeDate } from "@/helpers/mask";
import {
  ConferenciasCaixaSchema,
  useConferenciasCaixa,
} from "@/hooks/financeiro/useConferenciasCaixa";
import { startOfDay } from "date-fns";
import { useEffect, useRef } from "react";
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
  } = useConferenciasCaixa().importDatasys();

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
    if (importDatasysIsSuccess) {
      setIsPending(false);
    } else {
      setIsPending(true);
    }
  }, [importDatasysIsPending]);

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
          }`}
        >
          {!disabled && (
            <span className="flex gap-3 ">
              <Button
                variant={"secondary"}
                size={"lg"}
                onClick={() =>
                  importDatasys({
                    id_filial: newDataCaixa.id_filial || "",
                    range_datas: {
                      from: startOfDay(newDataCaixa.data || ""),
                      to: startOfDay(newDataCaixa.data || ""),
                    },
                  })
                }
                disabled={isPending}
              >
                {isPending ? "Reimportando..." : "Reimportar Datasys"}
              </Button>
              <Button variant={"secondary"} size={"lg"} disabled={isPending}>
                Conciliar C/ Bases
              </Button>
            </span>
          )}
          {conferir && (
            <Button
              size={"lg"}
              onClick={() => changeStatus({ id, action: "conferir" })}
              disabled={isPending}
            >
              Informar Conferência
            </Button>
          )}
          {conferido && (
            <Button
              size={"lg"}
              variant={"success"}
              onClick={() => changeStatus({ id, action: "confirmar" })}
              disabled={isPending}
            >
              Confirmar Caixa
            </Button>
          )}
          {baixadoPendente && (
            <Button
              size={"lg"}
              variant={"warning"}
              className="justify-self-end"
              onClick={() => changeStatus({ id, action: "desconfirmar" })}
            >
              Desconfirmar Caixa
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCaixa;
