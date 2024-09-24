import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InputDate } from "@/components/custom/InputDate";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { startOfDay } from "date-fns";
import { useEffect, useState } from "react";

type ModalActionOcorrenciaProps = {
  modalOpen: boolean;
  handleClickCancel: () => void;
  actionOcorrencia: (date: Date) => void;
  action?: "Transferência" | "Duplicação";
  dataOcorrencia: string | Date;
};

const ModalActionOcorrencia = ({
  modalOpen,
  handleClickCancel,
  actionOcorrencia,
  action,
  dataOcorrencia,
}: ModalActionOcorrenciaProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);

  //^ Reseta a data ao fechar
  useEffect(() => {
    !modalOpen && setDate(undefined);
  }, [modalOpen]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle className="flex gap-4">
            {`${action} de ocorrência`}
          </DialogTitle>
        </DialogHeader>
        <InputDate value={date} onChange={(e: Date) => setDate(e)} />
        <DialogFooter className="flex sm:justify-between w-full">
          <Button variant={"secondary"} onClick={handleClickCancel}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (
                String(startOfDay(dataOcorrencia)) ===
                String(startOfDay(date || ""))
              ) {
                toast({
                  title: `Não é possível realizar a ${action?.toLowerCase()} para o mesmo dia do caixa`,
                  variant: "warning",
                });
              } else {
                actionOcorrencia(startOfDay(date || ""));
              }
            }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalActionOcorrencia;
