import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { normalizeDate } from "@/helpers/mask";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

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

  const {
    data,
    isLoading,
    isError,
    refetch: fetchBordero,
  } = useQuery({
    queryKey: ["fin_borderos", id_matriz],
    queryFn: async () =>
      await api.get("financeiro/contas-a-pagar/bordero/", {
        params: { filters: { termo: search, id_matriz }, pagination },
      }),
    enabled: open,
  });

  console.log(data);

  const pages = [...Array(data?.data?.pageCount).keys()].map(
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
    fetchBordero();
  }
  function pushSelection(item: BorderoProps) {
    handleSelection(item);
  }
  async function handlePaginationChange(index: number) {
    await new Promise((resolve) => {
      setPagination((prev) => ({ ...prev, pageIndex: index }));
      resolve(true);
    });
    fetchBordero();
  }
  async function handlePaginationUp() {
    await new Promise((resolve) => {
      const newPage = ++pagination.pageIndex;
      setPagination((prev) => ({ ...prev, pageIndex: newPage }));
      resolve(true);
    });
    fetchBordero();
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
    fetchBordero();
  }

  const searchRef = useRef<HTMLInputElement | null>(null);

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

          <div className="flex gap-3">
            <Input
              type="search"
              placeholder="Buscar..."
              ref={searchRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button onClick={() => handleSearch()}>Procurar</Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-72 w-full rounded-md border p-3">
          {data?.data?.rows
            .filter((item: BorderoProps) => item.id != id_bordero)
            .map((item: BorderoProps) => (
              <div
                key={"forn:" + item.id}
                className="flex gap-1 items-center bg-secondary text-secondary-foreground justify-between mb-1 border rounded-md p-2"
              >
                <span>
                  {item.id}
                  {" - "}
                  {item.conta_bancaria}
                  {" - "}
                  {normalizeDate(item.data_pagamento)}
                </span>
                <Button
                  size={"sm"}
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
                  disabled={pagination.pageIndex === 1}
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
                  disabled={pagination.pageIndex === pages.length}
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

export default ModalBorderos;
