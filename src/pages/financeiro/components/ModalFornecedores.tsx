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

import { normalizeCnpjNumber } from "@/helpers/mask";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import ModalFornecedor from "../cadastros/fornecedores/fornecedor/Modal";
import { useStoreFornecedor } from "../cadastros/fornecedores/fornecedor/store";

interface IModalFornecedores {
  open: boolean;
  handleSelection: (item: ItemFornecedor) => void;
  onOpenChange: () => void;
  closeOnSelection?: boolean;
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
  closeOnSelection,
}: IModalFornecedores) => {
  const [openModalFornecedor] = useStoreFornecedor((state) => [state.openModal]);
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
    queryKey: ["financeiro", "fornecedor", "lista", { termo: search, pagination }],
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
    if (closeOnSelection) onOpenChange();
  }

  const pageCount = (data && data.data.pageCount) || 0;
  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <div className="flex justify-between">
            <span className="flex flex-col gap-1">
              <DialogTitle>Lista de Fornecedores/Clientes</DialogTitle>
              <DialogDescription>Selecione um ao clicar no botão à direita.</DialogDescription>
            </span>
            <Button onClick={() => openModalFornecedor("")}>
              <Plus className="me-2" size={18} /> Novo Fornecedor
            </Button>
          </div>

          <SearchComponent handleSearch={handleSearch} />
        </DialogHeader>

        <ModalComponent
          isLoading={isLoading}
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
        >
          {data?.data?.rows.map((item: ItemFornecedor) => (
            <ModalComponentRow key={"fornKey:" + item.id}>
              <>
                <span>
                  {normalizeCnpjNumber(item.cnpj)} - {item.nome} {item.razao && " - " + item.razao}
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
      <ModalFornecedor onInsert={pushSelection} />
    </Dialog>
  );
};

export default ModalFornecedores;
