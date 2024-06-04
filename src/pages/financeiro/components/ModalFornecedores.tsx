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

import { normalizeCnpjNumber } from "@/helpers/mask";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface IModalFornecedores {
  open: boolean;
  handleSelection: (item: ItemFornecedor) => void;
  onOpenChange: () => void;
}

export type ItemFornecedor = {
  id: string;
  cnpj: string;
  razao: string;
  nome: string;
  favorecido?: string;
  cnpj_favorecido?: string;
  id_banco?: string;
  banco?: string;
  codigo_banco?: string;
  agencia?: string;
  dv_agencia?: string;
  conta?: string;
  dv_conta?: string;
  id_tipo_conta?: string;
  id_tipo_chave_pix?: string;
  chave_pix?: string;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalFornecedores = ({
  open,
  handleSelection,
  onOpenChange,
}: IModalFornecedores) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const {
    data,
    isLoading,
    isError,
    refetch: refetch,
  } = useQuery({
    queryKey: ["fornecedores"],
    queryFn: async () =>
      await api.get("financeiro/fornecedores/", {
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
  function pushSelection(item: ItemFornecedor) {
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
          <DialogTitle>Lista de Fornecedores/Clientes</DialogTitle>
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
          {data?.data?.rows.map((item: ItemFornecedor) => (
            <ModalComponentRow key={"fornKey:" + item.id}>
              <>
                <span>
                  {normalizeCnpjNumber(item.cnpj)} - {item.nome}{" "}
                  {item.razao && " - " + item.razao}
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

export default ModalFornecedores;
