import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InputWithLabel } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { useMailing } from "@/hooks/marketing/useMailing";
import { DialogDescription } from "@radix-ui/react-dialog";
import { formatDate } from "date-fns";
import { BadgePercent, Ban, Handshake, Info, MessageCircle } from "lucide-react";
import { useStoreCampanha } from "../../store";

export type ResultadoInteracao = {
  id: number;
  plataforma: string;
  id_cliente: number;
  datetime_contato_resposta: string;
  data_contato: string;
  hora_contato: string;
  status: string;
  operador: string;
  observacao: string;
  duracao_chamada: string;
};

const ModalVerCliente = () => {
  const [id, modalOpen, closeModal] = useStoreCampanha((state) => [
    state.id_cliente,
    state.modalVerClienteOpen,
    state.closeModalVerCliente,
  ]);

  const { data } = useMailing().getOneClienteCampanha(id);
  const interacoes: ResultadoInteracao[] = data?.interacoes || [];

  function handleClickCancel() {
    closeModal();
  }
  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Cliente: {id}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex p-1 gap-2 max-h-[70vh]">
          <div className="grid gap-3">
            <section className="flex flex-col gap-3 w-full overflow-auto scroll-thin p-3 bg-slate-200 dark:bg-blue-950 rounded-md">
              <div className="flex gap-2 items-center w-full">
                <Info />
                <h3 className="text-md font-medium">Informações do Cliente</h3>
              </div>
              <div className="flex gap-2 flex-1">
                <InputWithLabel
                  label="Nome:"
                  value={data?.cliente || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel label="CPF:" value={data?.cpf || ""} readOnly className="flex-1" />
                <InputWithLabel label="GSM:" value={data?.gsm || ""} readOnly className="flex-1" />
              </div>
              <div className="flex gap-2 flex-1">
                <InputWithLabel
                  label="Filial:"
                  value={data?.filial || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel label="UF:" value={data?.uf || ""} readOnly className="flex-1" />
                <InputWithLabel
                  label="Plano Anterior:"
                  value={data?.plano_habilitado || ""}
                  readOnly
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2 flex-1">
                <InputWithLabel
                  label="Plano Atual:"
                  value={data?.plano_atual || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel
                  label="Status:"
                  value={data?.status_plano || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel
                  label="Fidelizado:"
                  value={data?.fidelizado_aparelho ? "SIM" : "NÃO"}
                  readOnly
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2 flex-1">
                <InputWithLabel
                  label="Produto Última Compra:"
                  value={data?.produto_ultima_compra || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel
                  label="Data Última Compra:"
                  value={normalizeDate(data?.data_ultima_compra || "") || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel
                  label="Valor Última Compra:"
                  value={normalizeCurrency(data?.valor_caixa) || ""}
                  readOnly
                  className="flex-1"
                />
              </div>
            </section>
            <section className="flex flex-col gap-3 w-full overflow-auto scroll-thin p-3 bg-slate-200 dark:bg-blue-950 rounded-md">
              <div className="flex gap-2 items-center w-full">
                <Handshake />
                <h3 className="text-md font-medium">Fidelizações</h3>
              </div>
              <Table className="bg-background rounded-md">
                <TableHeader className="bg-secondary text-white">
                  <TableRow>
                    <TableHead className="text-foreground">Fidelização</TableHead>
                    <TableHead className="text-foreground">Data Expiração</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{data?.fidelizacao1 || "-"}</TableCell>
                    <TableCell>{normalizeDate(data?.data_expiracao_fid1 || "") || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{data?.fidelizacao2 || "-"}</TableCell>
                    <TableCell>{normalizeDate(data?.data_expiracao_fid2 || "") || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{data?.fidelizacao3 || "-"}</TableCell>
                    <TableCell>{normalizeDate(data?.data_expiracao_fid3 || "") || "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </section>
            <section className="flex flex-col gap-3 w-full overflow-auto scroll-thin p-3 bg-slate-200 dark:bg-blue-950 rounded-md">
              <div className="flex gap-2 items-center w-full">
                <BadgePercent />
                <h3 className="text-md font-medium">Nova Oferta</h3>
              </div>
              <div className="flex gap-2 flex-1">
                <InputWithLabel
                  label="Produto Ofertado:"
                  value={data?.produto_ofertado || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel
                  label="Vendedor:"
                  value={data?.vendedor || ""}
                  readOnly
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2 flex-1">
                <InputWithLabel
                  label="Valor Pré-pago:"
                  value={normalizeCurrency(data?.valor_pre) || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel
                  label="Valor Oferta:"
                  value={normalizeCurrency(data?.valor_plano) || ""}
                  readOnly
                  className="flex-1"
                />
                <InputWithLabel
                  label="Desconto:"
                  value={normalizeCurrency(data?.desconto) || ""}
                  readOnly
                  className="flex-1"
                />
              </div>
            </section>

            {interacoes.length > 0 && (
              <section className="flex flex-col gap-3 w-full overflow-auto scroll-thin p-3 bg-slate-200 dark:bg-blue-950 rounded-md">
                <div className="flex gap-2 items-center w-full">
                  <MessageCircle />
                  <h3 className="text-md font-medium">Interações</h3>
                </div>
                <Table className="bg-background rounded-md">
                  <TableHeader className="bg-secondary text-white">
                    <TableRow>
                      <TableHead className="text-foreground">Plataforma</TableHead>
                      <TableHead className="text-foreground">Status</TableHead>
                      <TableHead className="text-foreground">Data</TableHead>
                      <TableHead className="text-foreground">Duração</TableHead>
                      <TableHead className="text-foreground">Operador</TableHead>
                      <TableHead className="text-foreground">Observação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interacoes.map((resultado: ResultadoInteracao, index) => (
                      <TableRow className="uppercase" key={`${resultado.id} - ${index}`}>
                        <TableCell>{resultado.plataforma}</TableCell>
                        <TableCell>{resultado.status}</TableCell>
                        <TableCell>
                          {formatDate(resultado.datetime_contato_resposta, "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell>{resultado.duracao_chamada} seg.</TableCell>
                        <TableCell>{resultado.operador}</TableCell>
                        <TableCell>{resultado.observacao || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="flex gap-2 items-end flex-wrap">
          <Button variant={"secondary"} onClick={handleClickCancel}>
            <Ban size={18} className="me-2" />
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalVerCliente;
