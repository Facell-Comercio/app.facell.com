import SelectFilial from "@/components/custom/SelectFilial";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  EraserIcon,
  FilterIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

interface IModalTitulos {
  open: boolean;
  handleSelecion: (item: TitulosProps[]) => void;
  onOpenChange: () => void;
  id_matriz?: string;
  initialFilters?: {
    [key: string]: any;
  }
}

export type TitulosProps = {
  checked?: boolean;
  id_titulo: string;
  id_status?: string;
  status: string;
  previsao: string;
  nome_fornecedor: string;
  valor_total: string;
  num_doc: string;
  descricao: string;
  filial: string;
  data_pagamento?: string;
};

interface Filters {
  id?: string;
  fornecedor?: string;
  descricao?: string;
  num_doc?: string;
  tipo_data?: string;
  range_data?: DateRange;
  id_filial?: string;
}

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalTitulos = ({
  open,
  handleSelecion,
  onOpenChange,
  id_matriz,
  initialFilters,
}: IModalTitulos) => {
  const [ids, setIds] = useState<string[]>([]);
  const [titulos, setTitulos] = useState<TitulosProps[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });
  console.log('Inicial',initialFilters)
  const defaultFilters: Filters = {
    id: "",
    fornecedor: "",
    descricao: "",
    num_doc: "",
    id_filial: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  const {
    data,
    isLoading,
    isError,
    refetch: refetchTitulos,
  } = useQuery({
    queryKey: ["modal-titulos", id_matriz, filters],
    staleTime: 0,
    queryFn: async () =>
      await api.get("financeiro/contas-a-pagar/titulo/titulos-bordero", {
        params: {
          filters: { ...filters, id_matriz },
          pagination,
        },
      }),
    enabled: open,
  });


  useEffect(()=>{
    setFilters(prev=>({...prev, ...initialFilters}))
    refetchTitulos()
  }, [initialFilters])

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
    refetchTitulos();
  }

  async function handleClickResetFilters() {
    await new Promise((resolve) => {
      setFilters(prev=>({...prev, ...defaultFilters}));
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      resolve(true);
    });
    refetchTitulos();
  }

  function handleRemoveAll() {
    setTitulos([])
    setIds([])
  }
  function handleSelectAll() {
    data?.data?.rows.forEach((item: TitulosProps) => {
      const isAlreadyInTitulos = titulos.some(
        (existingItem) => existingItem.id_titulo === item.id_titulo
      );

      if (!isAlreadyInTitulos) {
        setTitulos((prevTitulos) => [
          ...prevTitulos,
          {
            id_titulo: item.id_titulo,
            id_status: item.id_status,
            status: item.status,
            filial: item.filial,
            previsao: item.previsao,
            nome_fornecedor: item.nome_fornecedor,
            valor_total: item.valor_total,
            num_doc: item.num_doc || "",
            descricao: item.descricao,
            data_pagamento: item.data_pagamento || "",
          },
        ]);

        setIds((prevIds) => [...prevIds, item.id_titulo.toString()]);
      }
    });
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
  async function handlePaginationSize(value: string) {
    await new Promise((resolve) => {
      setPagination((prev) => ({
        ...prev,
        pageSize: Number(value),
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
        id_status: item.id_status,
        status: item.status,
        filial: item.filial,
        previsao: item.previsao,
        nome_fornecedor: item.nome_fornecedor,
        valor_total: item.valor_total,
        num_doc: item.num_doc || "",
        descricao: item.descricao,
        data_pagamento: item.data_pagamento || "",
      },
    ]);
    setIds([...ids, item.id_titulo.toString()]);
  }

  if (isError) return <p>Ocorreu um erro ao tentar buscar os títulos</p>;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-[1000px]">
        <DialogHeader className="flex flex-1 w-full max-x-[80vw]">
          <DialogTitle>Lista de titulos</DialogTitle>
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
                <div className="flex gap-3 items-center">
                  <span>Filtros</span>
                  <Button size={"xs"} onClick={() => handleClickFilters()}>
                    Filtrar <FilterIcon size={12} className="ms-2" />
                  </Button>
                  <Button
                    size={"xs"}
                    onClick={() => handleClickResetFilters()}
                    variant="secondary"
                  >
                    Limpar <EraserIcon size={12} className="ms-2" />
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0 pt-3">
                <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
                  <div className="flex w-max space-x-4">
                    <Input
                      placeholder="ID Título"
                      className="w-[20ch]"
                      value={filters?.id || ''}
                      onChange={(e) => {
                        setFilters({ ...filters, id: e.target.value });
                      }}
                    />
                    <Input
                      placeholder="Fornecedor"
                      className="max-w-[200px]"
                      value={filters?.fornecedor || ''}
                      onChange={(e) => {
                        setFilters({ ...filters, fornecedor: e.target.value });
                      }}
                    />
                    <Input
                      placeholder="Descrição"
                      className="w-[20ch]"
                      value={filters?.descricao || ''}
                      onChange={(e) => {
                        setFilters({ ...filters, descricao: e.target.value });
                      }}
                    />
                    <Input
                      placeholder="Nº Doc"
                      className="w-[20ch]"
                      value={filters?.num_doc || ''}
                      onChange={(e) => {
                        setFilters({ ...filters, num_doc: e.target.value });
                      }}
                    />
                    <SelectFilial
                      id_matriz={id_matriz}
                      showAll
                      onChange={(id_filial) => {
                        setFilters({ ...filters, id_filial: id_filial });
                      }}
                    />
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-between mt-4">
            <Button
              variant={"destructive"}
              size={'sm'}
              onClick={() => handleRemoveAll()}
            >
              Remover Todos
            </Button>

            <Button
              variant={"outline"}
              size={'sm'}
              onClick={() => handleSelectAll()}
            >
              Selecionar Todos
            </Button>

          </div>

        </DialogHeader>

        <ScrollArea className="h-96 rounded-md">
          <table className="w-full border p-1">
            <thead>
              <tr className="text-sm">
                <th className="p-1">ID</th>
                <th className="p-1">Fornecedor</th>
                <th className="p-1">Descrição</th>
                <th className="p-1">Previsão</th>
                <th className="p-1">Doc</th>
                <th className="p-1">Valor</th>
                <th className="p-1">Filial</th>
                <th className="p-1">Ação</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.rows.map((item: TitulosProps, index: number) => {
                const isSelected = ids.includes(item.id_titulo.toString());
                return (
                  <tr
                    key={"titulos:" + item.id_titulo + index}
                    className={`bg-blue-100 dark:bg-blue-700 justify-between mb-1 border rounded-md p-1 px-2 ${isSelected &&
                      "bg-primary-foreground dark:bg-primary-foreground"
                      }`}
                  >
                    <td className="text-xs p-1 text-center">
                      {" "}
                      {item.id_titulo}
                    </td>
                    <td className="text-xs p-1">
                      {item.nome_fornecedor.slice(0, 20) +
                        (item.nome_fornecedor.length > 20 ? "..." : "")}
                    </td>
                    <td className="text-xs p-1">
                      {item.descricao.slice(0, 30) +
                        (item.descricao.length > 30 ? "..." : "")}
                    </td>
                    <td className="text-xs p-1 text-center">
                      {normalizeDate(item.previsao)}
                    </td>
                    <td className="text-xs p-1 text-center">{item.num_doc}</td>
                    <td className="text-xs p-1">
                      {normalizeCurrency(item.valor_total)}
                    </td>
                    <td className="text-xs p-1">{item.filial}</td>
                    <td className="text-center p-1">
                      <Button
                        size={"xs"}
                        variant={"outline"}
                        className="p-1"
                        onClick={() => {
                          handleSelection(item);
                        }}
                        disabled={isSelected}
                      >
                        {isSelected ? "Selecionado" : "Selecionar"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ScrollArea>

        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <Badge variant={'secondary'}>
              <p className="mr-1">Qtde: </p>
              {data?.data.rows.length}
            </Badge>
            <Badge variant={'secondary'}>
              <p className="mr-1">Valor Total: </p>
              {normalizeCurrency(
                data?.data.rows.reduce(
                  (acc: number, titulo: TitulosProps) =>
                    acc + +titulo.valor_total,
                  0
                ) || 0
              )}
            </Badge>
          </div>
          {titulos.length > 0 &&
            <div className="flex items-center gap-3">
              Selecionado:
              <Badge variant={'default'}>
                <p className="mr-1">Qtde: </p>
                {titulos.length}
              </Badge>
              <Badge variant={'default'}>
                <p className="mr-1">Valor: </p>
                {normalizeCurrency(
                  titulos?.reduce(
                    (acc: number, titulo: TitulosProps) =>
                      acc + +titulo.valor_total,
                    0
                  ) || 0
                )}
              </Badge>
            </div>
          }

        </div>
        <DialogFooter className="flex">
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
          <Button onClick={() => handleSelecion(titulos)}>Salvar seleção</Button>
          {/* <PaginationEllipsis /> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTitulos;
