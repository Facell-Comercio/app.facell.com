import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ModalComponentProps {
  pageCount: number;
  refetch: () => void;
  pagination: PaginationProps;
  setPagination: (
    pagination: PaginationProps | ((prev: PaginationProps) => PaginationProps)
  ) => void;
  children: JSX.Element;
  buttonSaveSelection?: React.ComponentType;
  info?: React.ComponentType;

  multiSelection?: boolean;
  handleRemoveAll?: () => void;
  handleSelectAll?: () => void;
}

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

export const ModalComponent = ({
  pageCount,
  refetch,
  pagination,
  setPagination,
  children,

  buttonSaveSelection: ButtonSaveSelection,
  info: Info,

  multiSelection,
  handleRemoveAll,
  handleSelectAll,
}: ModalComponentProps) => {
  const pages = [...Array(pageCount || 0).keys()].map((page) => page + 1);
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
    refetch();
  }
  async function handlePaginationUp() {
    await new Promise((resolve) => {
      const newPage = ++pagination.pageIndex;
      setPagination((prev) => ({ ...prev, pageIndex: newPage }));
      resolve(true);
    });
    refetch();
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
    refetch();
  }

  async function handlePaginationSize(value: string) {
    await new Promise((resolve) => {
      setPagination((prev) => ({
        ...prev,
        pageSize: Number(value),
      }));
      resolve(true);
    });
    refetch();
  }

  return (
    <>
      {multiSelection && handleRemoveAll && handleSelectAll && (
        <div className="flex justify-between">
          <Button
            variant={"destructive"}
            size={"sm"}
            onClick={() => handleRemoveAll()}
          >
            Remover Todos
          </Button>

          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => handleSelectAll()}
          >
            Selecionar Todos
          </Button>
        </div>
      )}
      <ScrollArea
        className={
          multiSelection
            ? "h-[60vh] sm:h-96 rounded-md border p-1"
            : "h-[60vh] sm:h-72 w-full rounded-md border p-1"
        }
      >
        {children}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {Info && <Info />}

      <DialogFooter>
        {multiSelection && (
          <div className="flex items-center space-x-2">
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={handlePaginationSize}
            >
              <SelectTrigger className="h-8 w-[80px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 20, 30, 40, 50, 100, 200, 300].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm font-medium min-w-fit">Linhas por página</p>
          </div>
        )}
        <Pagination className="items-center">
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
        {multiSelection && ButtonSaveSelection && <ButtonSaveSelection />}
        {/* <PaginationEllipsis /> */}
      </DialogFooter>
    </>
  );
};

type ModalComponentRowProps = {
  children: JSX.Element;
  className?: string;
};

export const ModalComponentRow = ({
  children,
  className,
}: ModalComponentRowProps) => {
  return (
    <div
      className={`flex items-center justify-between bg-secondary odd:bg-secondary/70 text-secondary-foreground mb-1 border rounded-md p-1 px-2 ${className}`}
    >
      {children}
    </div>
  );
};
