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
import { Filial } from "@/types/filial-type";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

interface IModalFiliais {
  open: boolean;
  handleSelection: (item: Filial) => void;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  id_matriz?: string | null;
  id_grupo_economico?: string | null;
  closeOnSelection?: boolean;
}

type DataProps = {
  description: string;
  item: any;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalFiliais = ({
  open,
  handleSelection,
  onOpenChange,
  id_matriz,
  id_grupo_economico,
  closeOnSelection,
}: IModalFiliais) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["filiais", id_matriz],
    queryFn: async () =>
      await api.get("filial", {
        params: {
          filters: { termo: search, id_matriz, id_grupo_economico },
          pagination,
        },
      }),
    enabled: open,
  });

  const dataRows = data?.data?.rows.map((item: Filial) => ({
    description: `${item.grupo_economico} - ${
      item.nome
    } - ${normalizeCnpjNumber(item.cnpj)}`,
    item,
  }));

  function pushSelection(item: any) {
    handleSelection(item);
    if (onOpenChange !== undefined && closeOnSelection) {
      onOpenChange(false);
    }
  }

  async function handleSearch(searchText: string) {
    await new Promise((resolve) => {
      setSearch(searchText);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      resolve(true);
    });
    refetch();
  }

  const pageCount = (data && data.data.pageCount) || 0;
  if (isLoading) return null;
  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lista de filiais</DialogTitle>
          <DialogDescription>
            Selecione ao clicar no botão à direita.
          </DialogDescription>

          <SearchComponent handleSearch={handleSearch} />
        </DialogHeader>
        <ModalComponent
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
        >
          {dataRows &&
            dataRows.map((row: DataProps, index: number) => (
              <ModalComponentRow
                key={"modal_filial_item_row:" + index + row.item}
              >
                <>
                  <span className="flex items-center text-sm">
                    {row.description}
                  </span>
                  <Button
                    size={"xs"}
                    className="p-1"
                    variant={"outline"}
                    onClick={() => {
                      pushSelection(row.item);
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

export default ModalFiliais;
