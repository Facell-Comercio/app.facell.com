import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { api } from "@/lib/axios";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { copyToClipboard } from "@/pages/financeiro/contas-pagar/titulos/titulo/helpers/helper";
import { useQueryClient } from "@tanstack/react-query";
import { CircleX, Copy, CopyCheck, Download, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { TbCurrencyReal } from "react-icons/tb";
import { BadgeBoletoStatus } from "../table/columns";
import { useStoreBoleto } from "./store";

export type NewBoletoProps = {
  id_filial?: string;
  valor?: string;
};

// type CaixaProps = {
//   id?: string;
//   data?: string;
//   saldo?: string;
//   saldo_no_boleto?: string;
//   saldo_final?: string;
//   status?: string;
// };

const ModalBoleto = () => {
  const [modalOpen, closeModal, id, setIsPending] = useStoreBoleto((state) => [
    state.modalOpen,
    state.closeModal,
    state.id,
    state.isPending,
    state.setIsPending,
  ]);
  const formRef = useRef<HTMLFormElement | null>(null);

  const baseURL = import.meta.env.VITE_BASE_URL_API;

  const { data } = useConferenciasCaixa().getOneBoleto(id);

  const {
    mutate: cancelar,
    isSuccess: cancelarIsSuccess,
    isPending: cancelarIsPending,
    isError: cancelarIsError,
  } = useConferenciasCaixa().cancelarBoleto();

  const queryClient = useQueryClient();

  const [modalContaBancariaOpen, setModalContaBancariaOpen] = useState<boolean>(false);
  const [isLoadingRemessaSelecao, setIsLoadingRemessaSelecao] = useState<boolean>(false);
  const [linkCopiado, setLinkCopiado] = useState<boolean>(false);
  
  const handleCopyLink = async ()=>{
    try {
      
      await copyToClipboard(`${baseURL}/visualizar.boleto.caixa?id=${data?.id}`);
      setLinkCopiado(true)
    } catch (error) {
      
    }finally{
      setTimeout(()=>{
        setLinkCopiado(false)
      }, 3000)
    }
      
  }

  async function handleSelectionContaBancaria(conta_bancaria: ItemContaBancariaProps) {
    try {
      setIsLoadingRemessaSelecao(true);
      const response = await api.post(
        "financeiro/controle-de-caixa/boletos/export-remessa",
        {
          id_grupo_economico: data.id_grupo_economico,
          id_conta_bancaria: conta_bancaria.id,
          id_boleto: data.id,
        },
        { responseType: "blob" }
      );
      downloadResponse(response);
      queryClient.invalidateQueries({
        queryKey: ["financeiro", "contas_pagar", "bordero", "detalhe"],
      });
      handleClickCancel();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ops!",
        // @ts-ignore
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setIsLoadingRemessaSelecao(false);
    }
  }

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
          <DialogTitle className="flex justify-between pe-4">
            Boleto: {id}
            <span className="flex gap-2">
              <Button
                onClick={handleCopyLink}
                size={"xs"}
                variant={linkCopiado ? "success" : "secondary"}
              >
                {linkCopiado ? <>
                  <CopyCheck size={14} className="me-1" />
                  Copiado!
                </>
                  :
                  <>
                    <Copy size={14} className="me-1" />
                    Copiar Link
                  </>
                }
              </Button>
              <Button
                onClick={() => {
                  window.open(`${baseURL}/visualizar.boleto.caixa?id=${data?.id}`, "_blank");
                }}
                size={"xs"}
                variant={"secondary"}
              >
                <Eye size={14} className="me-1" />
                Visualizar
              </Button>
            </span>
          </DialogTitle>
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
                      <TbCurrencyReal size={16} />
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

              {data?.obs && (
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-medium text-sm">Observação</label>
                  <Textarea readOnly value={data?.obs || "-"} />
                </div>
              )}
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
          <ModalContasBancarias
            open={modalContaBancariaOpen}
            handleSelection={handleSelectionContaBancaria}
            onOpenChange={() => setModalContaBancariaOpen((prev) => !prev)}
            id_grupo_economico={data?.id_grupo_economico || ""}
          />
        </ScrollArea>
        <DialogFooter>
          <div className="flex gap-2 justify-between w-full">
            <AlertPopUp
              title={"Deseja realmente cancelar esse boleto?"}
              description="Essa ação fará com que todos os caixas relacionados a ele recuperem o saldo usado."
              action={() => {
                cancelar(id || "");
              }}
            >
              {data && (data.status === "aguardando_emissao" || data.status === "emitido") && (
                <Button variant={"destructive"}>
                  <CircleX size={18} className="me-2" />
                  Cancelar Boleto
                </Button>
              )}
            </AlertPopUp>
            {data && (data.status === "aguardando_emissao" || data.status === "erro") && (
              <Button
                variant={"violet"}
                disabled={isLoadingRemessaSelecao}
                onClick={() => setModalContaBancariaOpen(true)}
              >
                {isLoadingRemessaSelecao ? (
                  <>
                    <FaSpinner size={16} className="me-2 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="me-2" size={16} />
                    Exportar Remessa
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalBoleto;
