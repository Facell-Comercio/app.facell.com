import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
import { normalizeCurrency, normalizeDate, normalizeFirstAndLastName } from "@/helpers/mask";
import { AjustesProps, useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Pen, Plus, Settings2 } from "lucide-react";
import { useStoreCaixa } from "../store";
import ModalAjuste, { tiposAjuste, tiposCaixa } from "./ModalAjuste";

type GetAllAjustesProps = {
  qtde_ajustes: number;
  ajustes: AjustesProps[];
};

const ModalAjustes = () => {
  const [modalOpen, closeModal, id_caixa, openModalAjuste, disabled, aprovado] = useStoreCaixa(
    (state) => [
      state.modalAjustesOpen,
      state.closeModalAjustes,
      state.id_caixa,
      state.openModalAjuste,
      state.disabled,
      state.ajusteAprovado,
    ]
  );

  const { data } = useConferenciasCaixa().getAllAjustes({
    filters: {
      id_caixa,
      aprovado,
    },
  });

  const ajusteEmFiliais = aprovado !== undefined;

  const newDataAjustes: GetAllAjustesProps & Record<string, any> = {} as GetAllAjustesProps &
    Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataAjustes[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataAjustes[key] = "";
    } else {
      newDataAjustes[key] = data[key];
    }
  }

  function handleClickCancel() {
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-4 justify-between items-center">
            <span className="flex gap-4 items-center">
              <Settings2 size={22} className="text-primary" />
              Ajustes: ({newDataAjustes?.qtde_ajustes || 0})
            </span>
            {!disabled && !ajusteEmFiliais && (
              <Button className="flex gap-2 me-4" size={"sm"} onClick={() => openModalAjuste("")}>
                <Plus />
                Novo Ajuste
              </Button>
            )}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="rounded-md overflow-auto scroll-thin">
          <Table>
            <TableHeader className="bg-secondary text-nowrap">
              <TableRow>
                {!disabled && <TableHead>Ação</TableHead>}
                <TableHead>Status</TableHead>
                {ajusteEmFiliais && (
                  <>
                    <TableHead>Filial</TableHead>
                    <TableHead>Data Caixa</TableHead>
                  </>
                )}
                <TableHead>Tipo</TableHead>
                <TableHead>De</TableHead>
                <TableHead>Para</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead>Usuário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newDataAjustes?.ajustes?.map((ajuste, index) => (
                <TableRow
                  className="bg-secondary/40 odd:bg-secondary/60 uppercase text-nowrap"
                  key={`ajuste: ${ajuste.id} - ${index}`}
                >
                  {!disabled && (
                    <TableCell>
                      <Button
                        size={"xs"}
                        variant={"warning"}
                        className="flex gap-2"
                        onClick={() => openModalAjuste(ajuste.id || "")}
                      >
                        <Pen size={14} />
                      </Button>
                    </TableCell>
                  )}
                  <TableCell>
                    {ajuste.aprovado ? (
                      <Badge variant={"success"}>Aprovado</Badge>
                    ) : (
                      <Badge variant={"warning"}>Aprovação Pendente</Badge>
                    )}
                  </TableCell>
                  {ajusteEmFiliais && (
                    <>
                      <TableCell>{ajuste?.filial}</TableCell>
                      <TableCell>{normalizeDate(ajuste?.data_caixa || "")}</TableCell>
                    </>
                  )}
                  <TableCell>
                    {tiposAjuste.filter((tipo) => tipo.value === ajuste.tipo_ajuste)[0].label}
                  </TableCell>
                  <TableCell>
                    {tiposCaixa.filter((tipo) => tipo.value === ajuste.saida)[0]?.label || " - "}
                  </TableCell>
                  <TableCell>
                    {tiposCaixa.filter((tipo) => tipo.value === ajuste.entrada)[0]?.label || " - "}
                  </TableCell>
                  <TableCell>{normalizeCurrency(ajuste.valor)}</TableCell>
                  <TableCell title={ajuste.obs} className="max-w-[50ch] truncate">
                    {ajuste.obs}
                  </TableCell>
                  <TableCell>{normalizeFirstAndLastName(ajuste.user || "")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
      <ModalAjuste />
    </Dialog>
  );
};

export default ModalAjustes;
