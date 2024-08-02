import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";

interface ModalComponentProps {
  isLoading: boolean;
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
  isLoading,
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  async function handlePaginationUp() {
    await new Promise((resolve) => {
      const newPage = ++pagination.pageIndex;
      setPagination((prev) => ({ ...prev, pageIndex: newPage }));
      resolve(true);
    });
    refetch();
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
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
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
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
      {!isLoading ? (
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
          <section
            ref={scrollAreaRef}
            className={
              "max-h-[55vh] sm:h-96 border p-1 rounded-md overflow-auto scroll-thin z-50"
            }
          >
            {pageCount !== 0 ? (
              children
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm opacity-75">
                Sem resultados
              </div>
            )}
          </section>

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
                    {[5, 10, 15, 20, 30, 40, 50, 100, 200, 300].map(
                      (pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <p className="text-sm font-medium min-w-fit">
                  Linhas por página
                </p>
              </div>
            )}
            <Pagination className="items-center">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant={"outline"}
                    disabled={pagination.pageIndex === 0 || pageCount === 0}
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
                    disabled={
                      pagination.pageIndex === pageCount - 1 || pageCount === 0
                    }
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
      ) : (
        <>
          <div className="max-h-[55vh] sm:h-96 border p-1 rounded-md overflow-auto scroll-thin z-50 flex flex-col gap-0.5">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div>
            <Skeleton className="h-10 w-full" />
          </div>
        </>
      )}
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
