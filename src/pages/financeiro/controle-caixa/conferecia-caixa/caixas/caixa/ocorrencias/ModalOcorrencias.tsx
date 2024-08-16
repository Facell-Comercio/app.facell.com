import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  OcorrenciasProps,
  useConferenciasCaixa,
} from "@/hooks/financeiro/useConferenciasCaixa";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { TbAlertTriangle } from "react-icons/tb";
import { useStoreCaixa } from "../store";
import ModalOcorrencia from "./ModalOcorrencia";
import RowVirtualizedFixedOcorrencias from "./RowVirtualizedOcorrencias";

const ModalOcorrencias = () => {
  const [modalOpen, closeModal, id_filial, data_caixa, openModalOcorrencia] =
    useStoreCaixa((state) => [
      state.modalOcorrenciasOpen,
      state.closeModalOcorrencias,
      state.id_filial,
      state.data_caixa,
      state.openModalOcorrencia,
    ]);

  const formRef = useRef(null);

  const { data, isLoading } = useConferenciasCaixa().getAllOcorrencias({
    filters: {
      id_filial,
      data_caixa,
    },
  });

  const newDataCaixa: OcorrenciasProps & Record<string, any> =
    {} as OcorrenciasProps & Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataCaixa[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataCaixa[key] = "";
    } else {
      newDataCaixa[key] = data[key];
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
            <span className="flex gap-4">
              <TbAlertTriangle size={22} className="text-red-500" />
              Ocorrências: ({data?.qtde_ocorrencias || 0})
            </span>
            <Button
              className="flex gap-2 me-4"
              size={"sm"}
              onClick={() => openModalOcorrencia("")}
              variant={"destructive"}
            >
              <Plus />
              Nova Ocorrência
            </Button>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <RowVirtualizedFixedOcorrencias data={data.ocorrencias} />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
      <ModalOcorrencia />
    </Dialog>
  );
};

export default ModalOcorrencias;
