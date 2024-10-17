import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMailing } from "@/hooks/marketing/useMailing";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ClienteProps, columnsTableClientes } from "./components/columns-clientes";
import { useStoreCampanha } from "./store";

const ModalCampanha = () => {
  const [id, modalOpen, closeModal] = useStoreCampanha((state) => [
    state.id,
    state.modalOpen,
    state.closeModal,
  ]);

  function handleClickCancel() {
    closeModal();
  }
  const { data, isLoading, isError } = useMailing().getOneCampanha(id);
  console.log(data);
  const clientes: ClienteProps[] = data?.clientes || [];
  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Campanha: {id}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex flex-col gap-3 max-h-[70vh]">
          <div className="grid w-full overflow-auto scroll-thin p-3 bg-slate-200 dark:bg-blue-950">
            <div className="grid bg-background rounded-lg">
              <DataVirtualTableHeaderFixed
                // @ts-ignore
                columns={columnsTableClientes}
                data={clientes}
                className={`h-[300px] border`}
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="flex gap-2 items-end flex-wrap">
          <Button variant={"secondary"} onClick={handleClickCancel}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCampanha;
