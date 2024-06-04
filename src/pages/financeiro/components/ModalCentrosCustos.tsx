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
import { useCentroCustos } from "@/hooks/financeiro/useCentroCustos";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { useState } from "react";

interface IModalCentrosCustos {
  open: boolean;
  handleSelection: (item: CentroCustos) => void;
  onOpenChange: (value: boolean) => boolean;
  closeOnSelection?: boolean;
  id_matriz?: string | null;
  id_grupo_economico?: string | null;
}

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalCentrosCustos = ({
  open,
  handleSelection,
  onOpenChange,
  closeOnSelection,
  id_matriz,
  id_grupo_economico,
}: IModalCentrosCustos) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError, refetch } = useCentroCustos().getAll({
    pagination,
    filters: { termo: search, id_matriz, id_grupo_economico },
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
  if (isLoading) return null;
  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Lista de centros de custo</DialogTitle>
          <DialogDescription>
            Selecione uma ao clicar no botão à direita.
          </DialogDescription>

          <SearchComponent handleSearch={handleSearch} />
        </DialogHeader>
        <ModalComponent
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
        >
          {data?.data?.rows.map((item: CentroCustos) => (
            <ModalComponentRow key={`centroCentroCustosRow.${item.id}`}>
              <>
                <span className="w-[40ch]">{item?.grupo_economico}</span>
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

export default ModalCentrosCustos;
