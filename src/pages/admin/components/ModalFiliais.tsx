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
  handleSelection?: (item: Filial) => void;
  handleMultiSelection?: (item: Filial[]) => void;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  id_matriz?: string | null;
  id_grupo_economico?: string | null;
  closeOnSelection?: boolean;
  multiSelection?: boolean;
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
  handleMultiSelection,
  onOpenChange,
  id_matriz,
  id_grupo_economico,
  closeOnSelection,
  multiSelection,
}: IModalFiliais) => {
  const [ids, setIds] = useState<string[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["filiais", id_matriz, id_grupo_economico],
    queryFn: async () =>
      await api.get("filial", {
        params: {
          filters: { 
              termo: search, 
                id_matriz: id_matriz ? id_matriz : undefined, 
                id_grupo_economico: id_grupo_economico ? id_grupo_economico : undefined
               },
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
    if (multiSelection) {
      const isAlreadyInFiliais = ids.some((id) => parseInt(id) === item.id);

      if (!isAlreadyInFiliais) {
        setIds((prevIds) => [...prevIds, String(item.id)]);
        setFiliais((prevFiliais) => [...prevFiliais, item]);
      } else {
        setIds((prevIds) => prevIds.filter((id) => parseInt(id) !== item.id));
        setFiliais((prevFiliais) => prevFiliais.filter((id) => id !== item.id));
      }
    } else {
      handleSelection && handleSelection(item);
      if (onOpenChange !== undefined && closeOnSelection) {
        onOpenChange(false);
      }
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

  function handleRemoveAll() {
    setFiliais([]);
    setIds([]);
  }
  function handleSelectAll() {
    data?.data?.rows.forEach((item: Filial) => {
      const isAlreadyInFiliais = filiais.some(
        (existingItem) => existingItem.id === item.id
      );

      if (!isAlreadyInFiliais) {
        setFiliais((prevVencimentos) => [
          ...prevVencimentos,
          {
            ...item,
          },
        ]);

        setIds((prevIds) => [...prevIds, String(item.id)]);
      }
    });
  }

  const ButtonSaveSelection = () => {
    return (
      <Button
        onClick={() => {
          handleMultiSelection && handleMultiSelection(filiais);
        }}
      >
        Salvar seleção
      </Button>
    );
  };

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
          multiSelection={multiSelection}
          handleRemoveAll={handleRemoveAll}
          handleSelectAll={handleSelectAll}
          buttonSaveSelection={ButtonSaveSelection}
        >
          {dataRows &&
            dataRows.map((row: DataProps, index: number) => {
              const isSelected = ids.includes(String(row.item.id));
              return (
                <ModalComponentRow
                  className={
                    isSelected
                      ? "bg-secondary/50 text-secondary-foreground/40"
                      : ""
                  }
                  key={"modal_filial_item_row:" + index + row.item}
                >
                  <>
                    <span className="flex items-center text-sm">
                      {row.description}
                    </span>
                    <Button
                      size={"xs"}
                      className={`p-1 ${
                        isSelected &&
                        "bg-secondary hover:bg-secondary hover:opacity-90"
                      }`}
                      variant={"outline"}
                      onClick={() => {
                        pushSelection(row.item);
                      }}
                    >
                      {isSelected ? "Desmarcar" : "Selecionar"}
                    </Button>
                  </>
                </ModalComponentRow>
              );
            })}
        </ModalComponent>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFiliais;
