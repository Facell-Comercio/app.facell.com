import { ModalComponent, ModalComponentRow } from "@/components/custom/ModalComponent";
import SearchComponent from "@/components/custom/SearchComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePerfil } from "@/hooks/adm/usePerfil";
import { useState } from "react";
import { PerfilFormData } from "../perfis/perfil/form-data";

interface IModalPerfil {
  open: boolean;
  handleSelection: (item: PerfilFormData) => void;
  onOpenChange: (value: boolean) => void;
  closeOnSelection?: boolean;
}

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalPerfil = ({ open, handleSelection, onOpenChange, closeOnSelection }: IModalPerfil) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError, refetch } = usePerfil().getAll({
    pagination,
    filters: { termo: search, active: 1 },
  });

  async function handleSearch(searchText: string) {
    await new Promise((resolve) => {
      setSearch(searchText);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      resolve(true);
    });
  }

  function pushSelection(item: PerfilFormData) {
    if (closeOnSelection) {
      // @ts-expect-error 'vai funcionar...'
      onOpenChange();
    }
    handleSelection(item);
  }

  const pageCount = (data && data.pageCount) || 0;
  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Lista de Perfis</DialogTitle>
          <DialogDescription>Selecione uma ao clicar no botão à direita.</DialogDescription>

          <SearchComponent handleSearch={handleSearch} />
        </DialogHeader>
        <ModalComponent
          isLoading={isLoading}
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
        >
          {data?.rows.map((item: PerfilFormData) => (
            <ModalComponentRow key={`perfisRow.${item.id}`}>
              <>
                <span className="w-full">{item.perfil}</span>
                <Button
                  size={"xs"}
                  className="p-1"
                  variant={"outline"}
                  onClick={() => {
                    pushSelection(item);
                  }}
                >
                  Selecionar
                </Button>
              </>
            </ModalComponentRow>
          ))}
        </ModalComponent>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPerfil;
