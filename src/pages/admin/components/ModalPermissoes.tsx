import {
  ModalComponent,
  ModalComponentRow,
} from "@/components/custom/ModalComponent";
import SearchComponent from "@/components/custom/SearchComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePermissoes } from "@/hooks/usePermissoes";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { Permissao } from "@/types/permissao-type";
import { useState } from "react";

interface IModalPermissoes {
  open: boolean;
  handleSelection: (item: Permissao) => void;
  onOpenChange: (value: boolean) => boolean;
  closeOnSelection?: boolean;
}

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalPermissoes = ({
  open,
  handleSelection,
  onOpenChange,
  closeOnSelection,
}: IModalPermissoes) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError, refetch } = usePermissoes().getAll({
    pagination,
    filters: { termo: search },
  });

  async function handleSearch(searchText: string) {
    await new Promise((resolve) => {
      setSearch(searchText);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      resolve(true);
    });
  }

  function pushSelection(item: CentroCustos) {
    if (closeOnSelection) {
      // @ts-expect-error 'vai funcionar...'
      onOpenChange((prev) => !prev);
    }
    handleSelection(item);
  }

  const pageCount = (data && data.data.pageCount) || 0;
  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Lista de Permissões</DialogTitle>
          <DialogDescription>
            Selecione uma ao clicar no botão à direita.
          </DialogDescription>

          <SearchComponent handleSearch={handleSearch} />
        </DialogHeader>
        <ModalComponent
          isLoading={isLoading}
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
        >
          {data?.data?.rows.map((item: CentroCustos) => (
            <ModalComponentRow key={`permissoesRow.${item.id}`}>
              <>
                <span className="w-full">{item.nome}</span>
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

export default ModalPermissoes;
