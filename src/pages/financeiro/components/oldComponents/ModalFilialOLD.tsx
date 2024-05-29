import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { normalizeCnpjNumber } from "@/helpers/mask";
import { api } from "@/lib/axios";
import { Filial } from "@/types/filial-type";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";

interface IModalFilialOLD {
  open: boolean;
  handleSelection: (item: Filial) => void;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  id_matriz?: string | null;
  id_grupo_economico?: string | null;
  closeOnSelection?: boolean;
}

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalFilialOLD = ({
  open,
  handleSelection,
  onOpenChange,
  id_matriz,
  id_grupo_economico,
  closeOnSelection,
}: IModalFilialOLD) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const {
    data,
    isLoading,
    isError,
    refetch: refetchFilial,
  } = useQuery({
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

  const pages = [...Array(data?.data?.pageCount || 0).keys()].map(
    (page) => page + 1
  );
  const arrayPages = pages.filter((i) => {
    if (i === 1 || i === pages.length) {
      return true;
    } else if (i >= pagination.pageIndex - 2 && i <= pagination.pageIndex + 2) {
      return true;
    }
    return false;
  });

  async function handleSearch() {
    await new Promise((resolve) => {
      setSearch(searchRef.current?.value || "");
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      resolve(true);
    });
    refetchFilial();
  }
  async function handlePaginationChange(index: number) {
    await new Promise((resolve) => {
      setPagination((prev) => ({ ...prev, pageIndex: index }));
      resolve(true);
    });
    refetchFilial();
  }
  async function handlePaginationUp() {
    await new Promise((resolve) => {
      const newPage = ++pagination.pageIndex;
      console.log(newPage);
      setPagination((prev) => ({ ...prev, pageIndex: newPage }));
      resolve(true);
    });
    refetchFilial();
  }
  async function handlePaginationDown() {
    await new Promise((resolve) => {
      const newPage = --pagination.pageIndex;
      setPagination((prev) => ({
        ...prev,
        pageIndex: newPage <= 0 ? 0 : newPage,
      }));
      resolve(true);
    });
    refetchFilial();
  }

  function pushSelection(item: Filial) {
    handleSelection(item);
    if (closeOnSelection) {
      onOpenChange(false);
    }
  }

  const searchRef = useRef<HTMLInputElement | null>(null);

  if (isLoading) return null;
  if (isError) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Lista de filiais</DialogTitle>
          <DialogDescription>
            Selecione ao clicar no botão à direita.
          </DialogDescription>

          <div className="flex gap-3">
            <Input
              ref={searchRef}
              type="search"
              className="h-9"
              placeholder="Buscar..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              type="button"
              variant={"tertiary"}
              size={"sm"}
              onClick={() => handleSearch()}
            >
              <Search size={18} className="me-2" /> Procurar
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-72 w-full rounded-md border p-3">
          {data?.data?.rows.map((item: Filial, index: number) => (
            <div
              key={"modal_filial_item:" + index}
              className="flex gap-1 items-center bg-secondary text-secondary-foreground justify-between mb-1 border rounded-md p-2"
            >
              <span className="text-sm">
                {item.grupo_economico} - {item.nome} -{" "}
                {normalizeCnpjNumber(item.cnpj)}
              </span>
              <Button
                size={"xs"}
                onClick={() => {
                  pushSelection(item);
                }}
              >
                Selecionar
              </Button>
            </div>
          ))}
        </ScrollArea>

        <DialogFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant={"outline"}
                  disabled={pagination.pageIndex === 0}
                  onClick={handlePaginationDown}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>
              {arrayPages.map((i) => {
                return (
                  <PaginationItem key={i}>
                    <Button
                      variant={
                        i - 1 === pagination.pageIndex ? "default" : "ghost"
                      }
                      onClick={() => handlePaginationChange(i - 1)}
                    >
                      {i}
                    </Button>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <Button
                  variant={"outline"}
                  disabled={pagination.pageIndex === pages.length - 1}
                  onClick={handlePaginationUp}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* <PaginationEllipsis /> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFilialOLD;
