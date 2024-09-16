import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import ModalButtons from "@/components/custom/ModalButtons";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { CircleX } from "lucide-react";
import { useEffect, useRef } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { BadgeBoletoStatus } from "../table/columns";
import { useStoreBoleto } from "./store";

export type NewBoletoProps = {
  id_filial?: string;
  valor?: string;
};

type CaixaProps = {
  id?: string;
  data?: string;
  saldo?: string;
  saldo_no_boleto?: string;
  saldo_final?: string;
  status?: string;
};

const initialPropsBoleto: NewBoletoProps = {
  id_filial: "",
  valor: "0",
};

const ModalBoleto = () => {
  const [modalOpen, closeModal, id, modalEditing, editModal, isPending, setIsPending] =
    useStoreBoleto((state) => [
      state.modalOpen,
      state.closeModal,
      state.id,
      state.modalEditing,
      state.editModal,
      state.isPending,
      state.setIsPending,
    ]);
  const formRef = useRef<HTMLFormElement | null>(null);

  const { data } = useConferenciasCaixa().getOneBoleto(id);

  const {
    mutate: cancelar,
    isSuccess: cancelarIsSuccess,
    isPending: cancelarIsPending,
    isError: cancelarIsError,
  } = useConferenciasCaixa().cancelarBoleto();

  // function onSubmitData() {
  //   if (!formData.id_filial) {
  //     toast({ title: "Por algum motivo não há um id_filial", variant: "warning" });
  //     return;
  //   }
  //   insertOne(formData);
  // }

  useEffect(() => {
    if (cancelarIsPending) {
      setIsPending(true);
    }
    if (cancelarIsSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (cancelarIsError) {
      setIsPending(false);
    }
  }, [cancelarIsPending]);

  function handleClickCancel() {
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Boleto: {id}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && (
            <form
              className="flex gap-2 flex-wrap p-1"
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // onSubmitData();
              }}
            >
              <BadgeBoletoStatus
                status={data?.status}
                className="min-w-full flex justify-center py-2 mb-1"
              />
              <section className="flex gap-2 w-full">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-medium text-sm">Filial</label>
                  <Input readOnly value={data?.filial || ""} />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-medium text-sm">Valor do Boleto</label>
                  <span className="flex">
                    <Button variant={"secondary"} className="rounded-none rounded-l-md">
                      <TbCurrencyReal size={18} />
                    </Button>
                    <Input
                      value={data?.valor || ""}
                      type="number"
                      className="rounded-none rounded-r-md"
                      readOnly
                    />
                  </span>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-medium text-sm">Data de Criação</label>
                  <Input readOnly value={normalizeDate(data?.data)} />
                </div>
              </section>
              <section className="flex gap-2 w-full">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-medium text-sm">Data de Emissão</label>
                  <Input readOnly value={normalizeDate(data?.data_emissao) || "-"} />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-medium text-sm">Data de Vencimento</label>
                  <Input readOnly value={normalizeDate(data?.data_vencimento) || "-"} />
                </div>
              </section>
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-medium text-sm">Código de Barras</label>
                <Input readOnly value={data?.cod_barras || "-"} />
              </div>
              <Table
                className="rounded-md border-border w-full h-10 overflow-clip relative"
                divClassname="overflow-auto scroll-thin max-h-[40vh] border rounded-md mt-2"
              >
                <TableHeader className="sticky w-full top-0 h-10 border-b-2 border-border rounded-t-md bg-secondary">
                  <TableRow>
                    <TableHead>Data Caixa</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.caixas.map((row: any, index: number) => (
                    <TableRow
                      key={`boleto_caixa: ${index} - ${row.data_caixa}`}
                      className="uppercase odd:bg-secondary/60 even:bg-secondary/40"
                    >
                      <TableCell>{normalizeDate(row.data_caixa)}</TableCell>
                      <TableCell>{normalizeCurrency(row.valor)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </form>
          )}
          <ScrollBar />
        </ScrollArea>
        <DialogFooter>
          <ModalButtons
            id={id}
            cancel={handleClickCancel}
            edit={() => editModal(true)}
            modalEditing={modalEditing}
            formRef={formRef}
          >
            <AlertPopUp
              title={"Deseja realmente cancelar esse boleto?"}
              description="Essa ação fará com que todos os caixas relacionados a ele recuperem o saldo usado."
              action={() => {
                cancelar(id || "");
              }}
            >
              {data && (data.status === "aguardando_emissao" || data.status === "emitido") && (
                <Button variant={"destructive"} size={"lg"}>
                  <CircleX className="me-2" />
                  Cancelar Boleto
                </Button>
              )}
            </AlertPopUp>
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalBoleto;
