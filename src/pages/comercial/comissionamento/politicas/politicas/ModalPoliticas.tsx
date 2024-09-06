import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";

import { DataTable } from "@/components/custom/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { usePoliticas } from "@/hooks/comercial/usePoliticas";
import { columnsTable } from "./columns";
import { useStorePoliticas } from "./store-politicas";

const ModalPoliticas = () => {
  const [
    modalOpen,
    closeModal,
    pagination,
    setPagination,
  ] = useStorePoliticas((state) => [
    state.modalOpen,
    state.closeModal,
    state.pagination,
    state.setPagination,
  ]);

  const { data, isLoading } =
    usePoliticas().getAll({ pagination });

  const rows = data?.rows || [];
  const rowCount = data?.rowCount || 0;

  function handleClickCancel() {
    closeModal();
  }

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={handleClickCancel}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Políticas de Comissionamento
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <DataTable
              pagination={pagination}
              setPagination={setPagination}
              data={rows}
              rowCount={rowCount}
              columns={columnsTable}
              isLoading={isLoading}
            />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPoliticas;
