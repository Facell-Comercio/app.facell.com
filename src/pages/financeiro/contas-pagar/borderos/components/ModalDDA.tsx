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
  import { useState } from "react";
import { useStoreDDA } from "./storeDDA";
import { useDDA } from "@/hooks/financeiro/useDDA";
  
  type DataProps = {
    description: string;
    item: any;
  };
  
  type PaginationProps = {
    pageSize: number;
    pageIndex: number;
  };
  
  export const ModalDDA = () => {
    const modalOpen = useStoreDDA().modalOpen
    const toggleModal = useStoreDDA().toggleModal
    const filters = useStoreDDA().filters

    const [search, setSearch] = useState<string>("");
    const [pagination, setPagination] = useState<PaginationProps>({
      pageSize: 15,
      pageIndex: 0,
    });
  
    const { data, isLoading, isError, refetch } = useDDA().getAllDDA({pagination, filters})
  
    const dataRows = data?.data?.rows.map((item: Filial) => ({
      description: `${item.grupo_economico} - ${
        item.nome
      } - ${normalizeCnpjNumber(item.cnpj)}`,
      item,
    }));
  
    async function handleSearch(searchText: string) {
      await new Promise((resolve) => {
        setSearch(searchText);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        resolve(true);
      });
      refetch();
    }
  
    const pageCount = (data && data.data.pageCount) || 0;
    // if (isLoading) return null;
    // if (isError) return null;
    if (!modalOpen) return null;
  
    return (
      <Dialog open={modalOpen} onOpenChange={toggleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>DDA - Lista de boletos</DialogTitle>
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
                        console.log(row.item);
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