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
import { normalizeCurrency } from "@/helpers/mask";
import { useEspelhos } from "@/hooks/comercial/useEspelhos";
import { VendasInvalidadasProps } from "@/hooks/comercial/useVendasInvalidadas";
import { Eye } from "lucide-react";
import { useEffect } from "react";
import ModalVendaInvalidada from "../../vendas-invalidas/venda-invalida/Modal";
import { useStoreVendaInvalidada } from "../../vendas-invalidas/venda-invalida/store";
import { useStoreEspelho } from "./store";

const ModalVendasInvalidas = () => {
  const [
    modalOpen,
    closeModal,
    isPending,
    id_comissao,
    qtde_vendas_invalidas,
    editQtdeVendasInvalidas,
  ] = useStoreEspelho((state) => [
    state.modalVendasInvalidasOpen,
    state.closeModalVendasInvalidas,
    state.isPending,

    state.id,
    state.qtde_vendas_invalidas,
    state.editQtdeVendasInvalidas,
  ]);
  const [modalModalVendaInvalidada] = useStoreVendaInvalidada((state) => [state.openModal]);

  const { data, isLoading, isSuccess } = useEspelhos().getAllVendasInvalidadas(id_comissao);

  function handleClickCancel() {
    closeModal();
  }

  useEffect(() => {
    if (isSuccess) {
      editQtdeVendasInvalidas(data?.length);
    }
  }, [isPending, data?.length]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Vendas Invalidadas ({qtde_vendas_invalidas || 0})</DialogTitle>
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
                  <TableHead className=" text-nowrap">Ação</TableHead>
                  <TableHead className=" text-nowrap">Status</TableHead>
                  <TableHead className=" text-nowrap">Tipo</TableHead>
                  <TableHead className=" text-nowrap">Segmento</TableHead>
                  <TableHead className=" text-nowrap">Valor</TableHead>
                  <TableHead className=" text-nowrap">GSM</TableHead>
                  <TableHead className=" text-nowrap">CPF Cliente</TableHead>
                  <TableHead className=" text-nowrap">IMEI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.map((item: VendasInvalidadasProps, index: number) => {
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
                        <TableCell className="flex gap-2">
                          <Button
                            size={"xs"}
                            onClick={() => modalModalVendaInvalidada(item.id || "")}
                            disabled={isPending}
                            title="Ver venda invalidada"
                          >
                            <Eye size={16} />
                          </Button>
                        </TableCell>
                        <TableCell className={`${color}`}>
                          {item.status === "em_analise" ? "EM ANÁLISE" : item.status}
                        </TableCell>
                        <TableCell>{item.tipo}</TableCell>
                        <TableCell>{item.segmento || "-"}</TableCell>
                        <TableCell>{normalizeCurrency(item.valor)}</TableCell>
                        <TableCell>{item.gsm || "-"}</TableCell>
                        <TableCell>{item.cpf_cliente || "-"}</TableCell>
                        <TableCell>{item.imei || "-"}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
          <ModalVendaInvalidada />
        </ScrollArea>
        <DialogFooter className="hidden"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalVendasInvalidas;
