import AlertPopUp from "@/components/custom/AlertPopUp";
import { ModalComponent } from "@/components/custom/ModalComponent";
import SearchComponent from "@/components/custom/SearchComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type FiltersProps = {
  id_conta_bancaria?: string;
  descricao?: string;
  data_transacao?: string;
  valor?: number;
  id_extrato?: string;
};

interface IModalExtratosDuplicated {
  open: boolean;
  handleSelection: (item: ItemExtratosDuplicated) => void;
  onOpenChange: () => void;
  id?: string | null;
  filters?: FiltersProps;
}

export type ItemExtratosDuplicated = {
  id: string;
  documento: string;
  descricao: string;
  valor: string;
  conta_bancaria: string;
  data_transacao: string;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalExtratosDuplicated = ({
  open,
  handleSelection,
  onOpenChange,
  filters,
}: IModalExtratosDuplicated) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["financeiro", "conciliacao", "transacao", "lista", filters],
    queryFn: async () =>
      await api.get("financeiro/conciliacao-cr/extratos-duplicated", {
        params: {
          filters: { termo: search, ...filters },
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

  function pushSelection(item: ItemExtratosDuplicated) {
    handleSelection(item);
    onOpenChange();
  }

  const pageCount = (data && data.data.pageCount) || 0;
  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] sm:h-fit">
        <DialogHeader>
          <DialogTitle>Extratos</DialogTitle>
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
          <table className="w-full border p-1">
            <thead>
              <tr className="text-sm">
                <th className="p-1">Data Transação</th>
                <th className="p-1">Conta Bancária</th>
                <th className="p-1">Documento</th>
                <th className="p-1">Valor</th>
                <th className="p-1">Previsão</th>
                <th className="p-1">Ação</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((item: ItemExtratosDuplicated, index: number) => (
                <tr
                  key={"transferenciaRow:" + item.id + index}
                  className="bg-secondary odd:bg-secondary/70 text-secondary-foreground justify-between mb-1 border rounded-md p-1 px-2"
                >
                  <td className="text-xs text-nowrap p-1 text-center">
                    {normalizeDate(item.data_transacao)}
                  </td>
                  <td className="text-xs text-nowrap p-1 text-center">{item.conta_bancaria}</td>
                  <td className="text-xs text-nowrap p-1 text-center">{item.documento}</td>
                  <td className="text-xs text-nowrap p-1 text-center">{item.descricao}</td>
                  <td className="text-xs text-nowrap p-1 text-center">
                    {normalizeCurrency(item.valor)}
                  </td>
                  <td className="text-xs text-nowrap p-1 text-center">
                    <AlertPopUp
                      title={"Deseja tratar como duplicidade?"}
                      description="O extrato selecionado será tratado como duplicado e não aparecerá mais na seção de extratos"
                      action={() => pushSelection(item)}
                    >
                      <Button size={"xs"} className="p-1" variant={"outline"} onClick={() => {}}>
                        Selecionar
                      </Button>
                    </AlertPopUp>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalComponent>
      </DialogContent>
    </Dialog>
  );
};

export default ModalExtratosDuplicated;
