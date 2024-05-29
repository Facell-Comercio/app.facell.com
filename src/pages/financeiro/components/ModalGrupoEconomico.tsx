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
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface IModalGrupoEconomico {
  open: boolean;
  handleSelection: (item: ItemGrupoEconomicoProps) => void;
  onOpenChange: () => void;
  id_matriz?: string | null;
}

export type ItemGrupoEconomicoProps = {
  id: string;
  id_matriz: string;
  nome: string;
  apelido: string;
  active: string;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalGruposEconomicos = ({
  open,
  handleSelection,
  onOpenChange,
  id_matriz,
}: IModalGrupoEconomico) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["grupos_economicos"],
    queryFn: async () =>
      await api.get("/grupo-economico", {
        params: {
          filters: { termo: search, id_matriz },
          pagination,
        },
      }),
    enabled: open,
  });

  async function handleSearch(searchText: string) {
    await new Promise((resolve) => {
      setSearch(searchText);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      resolve(true);
    });
    refetch();
  }
  function pushSelection(item: ItemGrupoEconomicoProps) {
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
          <DialogTitle>Lista de Grupos Economicos</DialogTitle>
          <DialogDescription>
            Selecione um ao clicar no botão à direita.
          </DialogDescription>

          <SearchComponent handleSearch={handleSearch} />
        </DialogHeader>

        <ModalComponent
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
        >
          {data?.data?.rows.map(
            (item: ItemGrupoEconomicoProps, index: number) => (
              <ModalComponentRow
                key={"grupoEconomicoRow:" + item.id + index}
                componentKey={"grupoEconomico:" + item.id + index}
              >
                <>
                  <span>{item.nome && item.nome.toUpperCase()}</span>
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
            )
          )}
        </ModalComponent>
      </DialogContent>
    </Dialog>
  );
};

export default ModalGruposEconomicos;
