import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useRef, useState } from "react";
import { useStoreBordero } from "./store";

import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { normalizeDate } from "@/helpers/mask";
import { useBordero } from "@/hooks/useBordero";
import { BorderoSchemaProps } from "./Modal";

const ModalMoveTitulos = () => {
  // const { mutate: insertOne } = useOrcamento().insertOne();
  const [newBorderoData, setNewBorderoData] = useState<BorderoSchemaProps>({});
  const modalMoveTitulosOpen = useStoreBordero().modalMoveTitulosOpen;
  const closeMoveTitulosModal = useStoreBordero().closeMoveTitulosModal;
  const [refDate, setRefDate] = useState({
    mes: (new Date().getMonth() + 1).toString(),
    ano: new Date().getFullYear().toString(),
  });

  const id = useStoreBordero().id;
  const formRef = useRef(null);

  const { data, isLoading } = useBordero().getOne(id);
  const newData: BorderoSchemaProps & Record<string, any> =
    {} as BorderoSchemaProps & Record<string, any>;

  for (const key in data?.data) {
    if (typeof data?.data[key] === "number") {
      newData[key] = String(data?.data[key]);
    } else if (data?.data[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = data?.data[key];
    }
  }

  console.log(newData);

  function handleClickCancel() {
    closeMoveTitulosModal();
  }

  function onSubmitData() {
    console.log(newData);
    // insertOne(newData);

    closeMoveTitulosModal();
  }

  return (
    <div>
      <Dialog
        open={modalMoveTitulosOpen}
        onOpenChange={() => handleClickCancel()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transferência de Títulos</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            {modalMoveTitulosOpen && !isLoading ? (
              <form
                ref={formRef}
                onSubmit={() => onSubmitData()}
                className="flex gap-2 items-end flex-col"
              >
                <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg w-full">
                  <div className="flex justify-between mb-3">
                    <div className="flex gap-2">
                      <span className="text-lg font-bold ">Borderô Saída</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="flex-1 max-w-[14ch] text-center">
                      <label className="text-sm font-medium">ID</label>
                      <Input
                        value={newData.id}
                        disabled
                        className="text-center"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">
                        Conta Bancária
                      </label>
                      <Input value={newData.conta_bancaria} disabled />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">
                        Data Pagamento
                      </label>
                      <Input
                        value={normalizeDate(newData.data_pagamento)}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg w-full">
                  <div className="flex justify-between mb-3">
                    <div className="flex gap-2">
                      <span className="text-lg font-bold ">
                        Borderô Entrada
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="flex-1 max-w-[14ch] text-center">
                      <label className="text-sm font-medium">ID</label>
                      <Input
                        value={newBorderoData.id}
                        readOnly
                        className="text-center"
                        placeholder="Selecione..."
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">
                        Conta Bancária
                      </label>
                      <Input
                        value={newBorderoData.conta_bancaria}
                        readOnly
                        placeholder="Selecione..."
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">
                        Data Pagamento
                      </label>
                      <Input
                        value={normalizeDate(newBorderoData.data_pagamento)}
                        readOnly
                        placeholder="Selecione..."
                      />
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
                <Skeleton className="w-full row-span-1" />
                <Skeleton className="w-full row-span-3" />
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="flex gap-2 items-end flex-wrap">
            <AlertPopUp
              title="Deseja realmente realizar essa tranferência de titulos?"
              description="Os títulos desse borderô serão transferidos para o outro borderô."
              action={() => console.log("Transferido")}
            >
              <Button>Transferir</Button>
            </AlertPopUp>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalMoveTitulos;
