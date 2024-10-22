import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogDescription } from "@radix-ui/react-dialog";
import { formatDate } from "date-fns";
import { Log } from "./RowVirtualizedFixed";
import { useStoreLogs } from "./store";
type ModalProps = {
  data: Log;
};
const ModalLog = ({ data }: ModalProps) => {
  const [id, modalOpen, closeModal] = useStoreLogs((state) => [
    state.id,
    state.modalOpen,
    state.closeModal,
  ]);

  function handleClickCancel() {
    closeModal();
  }

  let tipo = "";
  if (!data) {
    return;
  }
  if (data.level === 30) {
    tipo = "INFO";
  } else if (data.level === 40) {
    tipo = "WARNING";
  } else if (data.level === 50) {
    tipo = "ERROR";
  }

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>PID: {id}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] w-full">
          <section className="grid grid-cols-2 md:grid-cols-3 gap-2 flex-wrapflex-wrap">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 col-span-2 md:col-span-3">
              <span className="flex-1">
                <label className="text-sm font-medium">Módulo</label>
                <Input className="mt-2" type="text" value={data.module} readOnly />
              </span>
              <span className="flex-1">
                <label className="text-sm font-medium">Origem</label>
                <Input className="mt-2" type="text" value={data.origin} readOnly />
              </span>
              <span className="col-span-2 md:col-span-1">
                <label className="text-sm font-medium">Método</label>
                <Input className="mt-2" type="text" value={data.method} readOnly />
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 col-span-2 md:col-span-3">
              <span className="flex-1">
                <label className="text-sm font-medium">Data</label>
                <Input
                  className="mt-2"
                  type="text"
                  value={formatDate(data.date, "dd/MM/yyyy")}
                  readOnly
                />
              </span>
              <span className="flex-1">
                <label className="text-sm font-medium">Tipo</label>
                <Input className={`mt-2 `} type="text" value={tipo} readOnly />
              </span>
              <span className="col-span-2 md:col-span-1">
                <label className="text-sm font-medium">Nome do Erro</label>
                <Input
                  className={`mt-2`}
                  type="text"
                  value={(data.data && data.data.name && data.data.name.toUpperCase()) || "-"}
                  readOnly
                />
              </span>
            </div>
            <div className="flex gap-2 col-span-2 md:col-span-3 max-h-[40vh]">
              <span className="grid grid-cols-1 flex-1">
                <label className="text-sm font-medium">Mensagem</label>
                <code className="flex flex-col flex-1 gap-2 border p-2 rounded-md overflow-auto scroll-thin text-gray-500 dark:text-gray-400">
                  <p>{data.data && data.data.message && data.data.message.toUpperCase()}</p>
                  {(data.data && data.data.stack) || "-"}
                </code>
              </span>
            </div>
          </section>
        </ScrollArea>
        <DialogFooter>
          <Button variant={"secondary"} onClick={() => handleClickCancel()}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalLog;
