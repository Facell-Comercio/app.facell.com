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
import { normalizeDate } from "@/helpers/mask";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

interface IModalTitulos {
  open: boolean;
  handleSelecion: (item: TitulosProps[]) => void;
  onOpenChange: () => void;
  id_matriz?: string;
}

export type TitulosProps = {
  checked?: boolean;
  id_titulo: string;
  vencimento: string;
  nome_fornecedor: string;
  valor_total: string;
  num_doc: string;
  descricao: string;
  filial: string;
  data_pagamento?: string;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalTitulos = ({
  open,
  handleSelecion,
  onOpenChange,
  id_matriz,
}: IModalTitulos) => {
  const [ids, setIds] = useState<string[]>([]);
  const [titulos, setTitulos] = useState<TitulosProps[]>([]);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const queryKey = id_matriz ? `titulos:${id_matriz}` : "titulos";
  const {
    data,
    isLoading,
    isError,
    refetch: refetchTitulos,
  } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      await api.get("financeiro/contas-a-pagar/titulo/titulos-bordero", {
        params: {
          filters: { termo: search, id_matriz },
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
    refetchTitulos();
  }
  async function handlePaginationChange(index: number) {
    await new Promise((resolve) => {
      setPagination((prev) => ({ ...prev, pageIndex: index }));
      resolve(true);
    });
    refetchTitulos();
  }
  async function handlePaginationUp() {
    await new Promise((resolve) => {
      const newPage = ++pagination.pageIndex;
      console.log(newPage);
      setPagination((prev) => ({ ...prev, pageIndex: newPage }));
      resolve(true);
    });
    refetchTitulos();
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
    refetchTitulos();
  }

  function handleSelection(item: TitulosProps) {
    setTitulos([
      ...titulos,
      {
        id_titulo: item.id_titulo,
        filial: item.filial,
        vencimento: item.vencimento,
        nome_fornecedor: item.nome_fornecedor,
        valor_total: item.valor_total,
        num_doc: item.num_doc || "",
        descricao: item.descricao,
        data_pagamento: item.data_pagamento || "",
      },
    ]);
    setIds([...ids, item.id_titulo.toString()]);
  }

  const searchRef = useRef<HTMLInputElement | null>(null);

  if (isLoading) return null;
  if (isError) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Lista de titulos</DialogTitle>
          <DialogDescription>
            Selecione um ao clicar no botão à direita.
          </DialogDescription>

          <div className="flex gap-3">
            <Input
              ref={searchRef}
              type="search"
              placeholder="Buscar..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button onClick={() => handleSearch()}>Procurar</Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-72 w-full rounded-md border p-1">
          {data?.data?.rows.map((item: TitulosProps, index: number) => (
            <div
              key={"titulos:" + item.id_titulo + index}
              className={`flex gap-1 items-center bg-blue-100 dark:bg-blue-700 justify-between mb-1 border rounded-md p-1 px-2 ${
                ids.includes(item.id_titulo.toString()) &&
                "bg-blue-500 dark:bg-blue-800 text-gray-400"
              }`}
            >
              <span className="text-xs">
                {item.id_titulo} - {item.descricao.slice(0, 30) + "... - "}
                {normalizeDate(item.vencimento) + " - "}
                {item.nome_fornecedor
                  ? item.nome_fornecedor.slice(0, 20) +
                    (item.nome_fornecedor.length > 20 ? "..." : "")
                  : ""}{" "}
                -{item.num_doc ? item.num_doc + " - " : ""}{" "}
                {"R$" + item.valor_total + " - "}
                {item.filial}
              </span>
              <Button
                size={"sm"}
                className="p-1"
                onClick={() => {
                  handleSelection(item);
                }}
                disabled={ids.includes(item.id_titulo.toString())}
              >
                Selecionar
              </Button>
            </div>
          ))}
        </ScrollArea>

        <DialogFooter className="flex">
          <Pagination className="items-cente">
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
          <Button onClick={() => handleSelecion(titulos)}>Salvar</Button>
          {/* <PaginationEllipsis /> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTitulos;
