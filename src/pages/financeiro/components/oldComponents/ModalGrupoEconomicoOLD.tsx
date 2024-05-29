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
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface IModalGrupoEconomico {
  open: boolean;
  handleSelection: (item: ItemGrupoEconomicoProps) => void;
  onOpenChange: () => void;
  id_matriz?: string | null;
}

export type ItemGrupoEconomicoProps = {
  id: string;
  id_matriz: string;
  nome: string;
  apelido: string;
  active: string;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalGruposEconomicosOLD = ({
  open,
  handleSelection,
  onOpenChange,
  id_matriz,
}: IModalGrupoEconomico) => {
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const {
    data,
    isLoading,
    isError,
    refetch: refetchGrupoEconomico,
  } = useQuery({
    queryKey: ["grupos_economicos"],
    queryFn: async () =>
      await api.get("/grupo-economico", {
        params: {
          filters: { id_matriz },
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

  async function handlePaginationChange(index: number) {
    await new Promise((resolve) => {
      setPagination((prev) => ({ ...prev, pageIndex: index }));
      resolve(true);
    });
    refetchGrupoEconomico();
  }
  async function handlePaginationUp() {
    await new Promise((resolve) => {
      const newPage = ++pagination.pageIndex;
      setPagination((prev) => ({ ...prev, pageIndex: newPage }));
      resolve(true);
    });
    refetchGrupoEconomico();
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
    refetchGrupoEconomico();
  }

  function pushSelection(item: ItemGrupoEconomicoProps) {
    handleSelection(item);
  }

  if (isLoading) return null;
  if (isError) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Lista de Grupos Economicos</DialogTitle>
          <DialogDescription>
            Selecione um ao clicar no botão à direita.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-72 w-full rounded-md border p-3">
          {data?.data?.rows.map(
            (item: ItemGrupoEconomicoProps, index: number) => (
              <div
                key={"plano_contas:" + item.id + index}
                className="flex gap-1 items-center bg-secondary text-secondary-foreground justify-between mb-1 border rounded-md p-2"
              >
                <span>{item.nome && item.nome.toUpperCase()}</span>
                <Button
                  size={"sm"}
                  onClick={() => {
                    pushSelection(item);
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

export default ModalGruposEconomicosOLD;
