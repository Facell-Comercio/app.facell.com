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

import { normalizeDate } from "@/helpers/mask";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface IModalBorderos {
  open: boolean;
  handleSelection: (item: BorderoProps) => void;
  onOpenChange: () => void;
  id_matriz?: string;
  id_bordero?: string;
}

export type BorderoProps = {
  id: string;
  conta_bancaria?: string;
  id_conta_bancaria: string;
  data_pagamento: string;
  id_matriz: string;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalBorderos = ({
  open,
  handleSelection,
  onOpenChange,
  id_matriz,
  id_bordero,
}: IModalBorderos) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["financeiro", "contas_pagar", "bordero", "lista", {id_matriz, termo: search}],
    queryFn: async () =>
      await api.get("financeiro/contas-a-pagar/bordero/", {
        params: { filters: { termo: search, id_matriz }, pagination },
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
  function pushSelection(item: BorderoProps) {
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
          <DialogTitle>Borderos de pagamento</DialogTitle>
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
          {data?.data?.rows
            .filter((item: BorderoProps) => item.id != id_bordero)
            .map((item: BorderoProps) => (
              <ModalComponentRow key={"borderoRow:" + item.id}>
                <>
                  <span>
                    {item.id}
                    {" - "}
                    {item.conta_bancaria}
                    {" - "}
                    {normalizeDate(item.data_pagamento)}
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

export default ModalBorderos;
