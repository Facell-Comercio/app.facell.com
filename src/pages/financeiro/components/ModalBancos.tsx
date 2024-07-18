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

interface IModalBancos {
  open: boolean;
  handleSelection: (item: ItemBancos) => void;
  onOpenChange: () => void;
  id?: string | null;
}

export type ItemBancos = {
  id: string;
  codigo: string;
  nome: string;
  tipo: string;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalBancos = ({ open, handleSelection, onOpenChange }: IModalBancos) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["financeiro", "banco", "lista", {termo: search, pagination}],
    queryFn: async () =>
      await api.get("financeiro/bancos", {
        params: { filters: { termo: search }, pagination },
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

  function pushSelection(item: ItemBancos) {
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
          <DialogTitle>Bancos</DialogTitle>
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
          {data?.data?.rows.map((item: ItemBancos, index: number) => (
            <ModalComponentRow key={"bancosRow:" + item.id + index}>
              <>
                <span>
                  {item.codigo} - {item.nome}
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

export default ModalBancos;
