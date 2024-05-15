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
import { useCentroCustos } from "@/hooks/financeiro/useCentroCustos";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

interface IModalCentrosCustos {
  open: boolean;
  handleSelection: (item: CentroCustos) => void;
  onOpenChange: (value: boolean) => boolean;
  closeOnSelection?: boolean;
  id_matriz?: string | null;
  id_grupo_economico?: string | null;
}

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalCentrosCustos = ({
  open,
  handleSelection,
  onOpenChange,
  closeOnSelection,
  id_matriz,
  id_grupo_economico,
}: IModalCentrosCustos) => {
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const { data, isLoading, isError } = useCentroCustos().getAll({
    pagination,
    filters: { termo: search, id_matriz, id_grupo_economico },
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
  }
  async function handlePaginationChange(index: number) {
    await new Promise((resolve) => {
      setPagination((prev) => ({ ...prev, pageIndex: index }));
      resolve(true);
    });
  }
  async function handlePaginationUp() {
    await new Promise((resolve) => {
      const newPage = ++pagination.pageIndex;
      console.log(newPage);
      setPagination((prev) => ({ ...prev, pageIndex: newPage }));
      resolve(true);
    });
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
  }

  function pushSelection(item: CentroCustos) {
    if (closeOnSelection) {
      // @ts-expect-error 'vai funcionar...'
      onOpenChange((prev) => !prev);
    }
    handleSelection(item);
  }

  const searchRef = useRef<HTMLInputElement | null>(null);

  if (isLoading) return null;
  if (isError) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Lista de centros de custo</DialogTitle>
          <DialogDescription>
            Selecione uma ao clicar no botão à direita.
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

        <div className="flex px-3">
          <span className="w-[40ch]">Grupo econômico</span>
          <span className="w-full">Centro de custos</span>
          <span>Ação</span>
        </div>
        <ScrollArea className="h-72 w-full rounded-md border p-3">
          {data?.data?.rows.map((item: CentroCustos) => (
            <div
              key={`centroCentroCustos.${item.id}`}
              className="flex gap-1 items-center bg-blue-100 dark:bg-blue-700 justify-between mb-1 border rounded-md p-2"
            >
              <span className="w-[40ch]">{item?.grupo_economico}</span>
              <span className="w-full">{item.nome}</span>
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

export default ModalCentrosCustos;
