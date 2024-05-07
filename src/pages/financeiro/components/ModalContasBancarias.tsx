import SelectGrupoEconomico from "@/components/custom/SelectGrupoEconomico";
import { AccordionItem } from "@/components/ui/accordion";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  EraserIcon,
  FilterIcon,
} from "lucide-react";
import { useState } from "react";

interface IModalContaBancaria {
  open: boolean;
  handleSelecion: (item: ItemContaBancariaProps) => void;
  onOpenChange: () => void;
  closeOnSelection?: boolean;
  id_matriz?: string | null;
}

export type ItemContaBancariaProps = {
  id: string;
  grupo_economico: string;
  descricao: string;
  banco: string;
  id_matriz: string;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

interface Filters {
  id_grupo_economico?: string;
  descricao?: string;
  banco?: string;
}

const ModalContasBancarias = ({
  open,
  handleSelecion,
  onOpenChange,
  closeOnSelection,
  id_matriz,
}: IModalContaBancaria) => {
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });
  const initialFilters: Filters = {
    id_grupo_economico: "",
    descricao: "",
    banco: "",
  };
  const [filters, setFilters] = useState(initialFilters);

  const {
    data,
    isLoading,
    isError,
    refetch: refetchContaBancaria,
  } = useQuery({
    queryKey: ["contas_bancarias", id_matriz],
    queryFn: async () =>
      await api.get("financeiro/contas-bancarias/", {
        params: {
          filters: { ...filters, id_matriz },
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

  async function handleClickFilters() {
    await new Promise((resolve) => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      resolve(true);
    });
    refetchContaBancaria();
  }

  async function handleClickResetFilters() {
    await new Promise((resolve) => {
      setFilters(initialFilters);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      resolve(true);
    });
    refetchContaBancaria();
  }
  async function handlePaginationChange(index: number) {
    await new Promise((resolve) => {
      setPagination((prev) => ({ ...prev, pageIndex: index }));
      resolve(true);
    });
    refetchContaBancaria();
  }
  async function handlePaginationUp() {
    await new Promise((resolve) => {
      const newPage = ++pagination.pageIndex;
      setPagination((prev) => ({ ...prev, pageIndex: newPage }));
      resolve(true);
    });
    refetchContaBancaria();
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
    refetchContaBancaria();
  }

  function handleSelection(item: ItemContaBancariaProps) {
    handleSelecion(item);
    if(closeOnSelection){
      onOpenChange()
    }
  }

  if (isLoading) return null;
  if (isError) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Lista de plano de contas</DialogTitle>
          <DialogDescription>
            Selecione um ao clicar no botão à direita.
          </DialogDescription>

          <Accordion
            type="single"
            collapsible
            className="p-2 border-2 dark:border-slate-800 rounded-lg flex-1"
          >
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger className="py-0.5 hover:no-underline">
                Filtros
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
                  <div className="flex w-max space-x-4">
                    <Button size={"sm"} onClick={() => handleClickFilters()}>
                      Filtrar <FilterIcon size={12} className="ms-2" />
                    </Button>
                    <Button
                      size={"sm"}
                      onClick={() => handleClickResetFilters()}
                      variant="destructive"
                    >
                      Limpar <EraserIcon size={12} className="ms-2" />
                    </Button>

                    <SelectGrupoEconomico
                      showAll
                      value={filters.id_grupo_economico}
                      onChange={(id_grupo_economico) => {
                        setFilters({ id_grupo_economico: id_grupo_economico });
                      }}
                    />
                    <Input
                      placeholder="Descrição"
                      className="w-[20ch]"
                      value={filters.descricao}
                      onChange={(e) => {
                        setFilters({ ...filters, descricao: e.target.value });
                      }}
                    />
                    <Input
                      placeholder="Banco"
                      className="max-w-[200px]"
                      value={filters.banco}
                      onChange={(e) => {
                        setFilters({ ...filters, banco: e.target.value });
                      }}
                    />
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogHeader>

        <ScrollArea className="h-72 w-full rounded-md border p-3">
          {data?.data?.rows.map(
            (item: ItemContaBancariaProps, index: number) => (
              <div
                key={"plano_contas:" + item.id + index}
                className="flex gap-1 items-center bg-blue-100 dark:bg-blue-700 justify-between mb-1 border rounded-md p-2"
              >
                <span>
                  {item.grupo_economico && item.grupo_economico.toUpperCase()} -{" "}
                  {item.descricao && item.descricao.toUpperCase()} -{" "}
                  {item.banco && item.banco.toUpperCase()}
                </span>
                <Button
                  size={"sm"}
                  onClick={() => {
                    handleSelection(item);
                  }}
                >
                  Selecionar
                </Button>
              </div>
            )
          )}
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

export default ModalContasBancarias;
