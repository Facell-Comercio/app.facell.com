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

interface IModalPlanosContas {
  open: boolean;
  handleSelection: (item: ItemPlanoContas) => void;
  onOpenChange: () => void;
  id_matriz?: string | null;
  id_grupo_economico?: string | null;
  tipo?: "Despesa" | "Receita";
}

export type ItemPlanoContas = {
  id: string;
  codigo: string;
  descricao: string;
  tipo: string;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalPlanosContas = ({
  open,
  handleSelection,
  onOpenChange,
  id_matriz,
  id_grupo_economico,
  tipo,
}: IModalPlanosContas) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["plano_contas", id_matriz],
    queryFn: async () =>
      await api.get("financeiro/plano-contas", {
        params: {
          filters: { termo: search, id_matriz, id_grupo_economico, tipo },
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

  function pushSelection(item: ItemPlanoContas) {
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
          <DialogTitle>Lista de plano de contas</DialogTitle>
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
          {data?.data?.rows.map((item: ItemPlanoContas, index: number) => (
            <ModalComponentRow key={"plano_contas_row:" + item.id + index}>
              <>
                <span>
                  {item.codigo} - {item.descricao}
                </span>
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

export default ModalPlanosContas;
