import fetchApi from "@/api/fetchApi";
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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface IModalUsersPermissaoAbonar {
  open: boolean;
  handleSelection: (item: UserPermisaoAbonar) => void;
  onOpenChange: () => void;
  id?: string | null;
}

export type UserPermisaoAbonar = {
  id: string;
  nome: string;
  permissao: string;
  email: string;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalUsersPermissaoAbonar = ({
  open,
  handleSelection,
  onOpenChange,
}: IModalUsersPermissaoAbonar) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["vales", "users_abonar", "lista", { termo: search }],
    queryFn: async () =>
      await fetchApi.comercial.vales.getAllUsersPermissaoAbonar({
        filters: { termo: search },
        pagination,
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

  function pushSelection(item: UserPermisaoAbonar) {
    handleSelection(item);
    onOpenChange();
  }

  const pageCount = (data && data.pageCount) || 0;
  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Usuários</DialogTitle>
          <DialogDescription>Selecione um ao clicar no botão à direita.</DialogDescription>

          <SearchComponent handleSearch={handleSearch} />
        </DialogHeader>

        <ModalComponent
          isLoading={isLoading}
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
        >
          {data?.rows.map((item: UserPermisaoAbonar, index: number) => (
            <ModalComponentRow key={"users_abono_row:" + item.id + index}>
              <>
                <span>{item.nome}</span>
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

export default ModalUsersPermissaoAbonar;
