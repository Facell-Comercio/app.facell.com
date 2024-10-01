import { ModalComponent, ModalComponentRow } from "@/components/custom/ModalComponent";
import SelectMatriz from "@/components/custom/SelectMatriz";
import { AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";
import { Accordion, AccordionContent, AccordionTrigger } from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useRef, useState } from "react";

interface IModalContaBancaria {
  open: boolean;
  handleSelection: (item: ItemContaBancariaProps) => void;
  onOpenChange: () => void;
  closeOnSelection?: boolean;
  id_matriz?: string | null;
  id_grupo_economico?: string;
  onlyDatasys?: boolean;
  onlyCaixa?: boolean;
}

export type ItemContaBancariaProps = {
  id: string;
  grupo_economico: string;
  descricao: string;
  banco: string;
  id_matriz: string;
  id_grupo_economico?: string;
  saldo?: string;
};

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

interface Filters {
  id_grupo_economico?: string;
  id_matriz?: string;
  descricao?: string;
  banco?: string;
  onlyDatasys?: number;
  onlyCaixa?: number;
}

const ModalContasBancarias = ({
  open,
  handleSelection,
  onOpenChange,
  closeOnSelection,
  id_matriz,
  id_grupo_economico,
  onlyDatasys,
  onlyCaixa,
}: IModalContaBancaria) => {
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const defaultFilters: Filters = {
    id_grupo_economico: "all",
    id_matriz: id_matriz || "all",
    descricao: "",
    banco: "",
    onlyDatasys: onlyDatasys ? 1 : 0,
    onlyCaixa: onlyCaixa ? 1 : 0,
  };

  const inputsRef = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [filters, setFilters] = useState(defaultFilters);

  const { data, isLoading, isError, refetch } = useQuery({
    staleTime: 0,
    refetchOnMount: true,
    queryKey: [
      "financeiro",
      "conta_bancaria",
      "lista",
      [{ filters, pagination, id_matriz, id_grupo_economico }],
    ],
    queryFn: async () =>
      await api.get("financeiro/contas-bancarias/", {
        params: {
          filters: { ...filters, id_grupo_economico },
          pagination,
        },
      }),
    enabled: open,
  });

  async function handleClickFilter() {
    await new Promise((resolve) => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      resolve(true);
    });
    refetch();
  }

  async function handleClickResetFilters() {
    await new Promise((resolve) => {
      setFilters((prev) => ({ ...prev, ...defaultFilters }));
      Object.keys(inputsRef.current).forEach((key) => {
        if (inputsRef.current[key]) {
          inputsRef.current[key]!.value = "";
        }
      });
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      resolve(true);
    });
    refetch();
  }

  function pushSelection(item: ItemContaBancariaProps) {
    handleSelection(item);
    if (closeOnSelection) {
      onOpenChange();
    }
  }

  const pageCount = (data && data.data.pageCount) || 0;
  const [itemOpen, setItemOpen] = useState<string>("item-1");

  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Contas bancárias</DialogTitle>
          <DialogDescription>Selecione uma ao clicar no botão à direita.</DialogDescription>

          <Accordion
            type="single"
            collapsible
            value={itemOpen}
            onValueChange={(e) => setItemOpen(e)}
            className="p-2 border dark:border-slate-800 rounded-lg flex-1"
          >
            <AccordionItem value="item-1" className="relative border-0">
              <div className="flex gap-3 items-center absolute start-16 top-1">
                <Button size={"xs"} onClick={() => handleClickFilter()}>
                  Aplicar <FilterIcon size={12} className="ms-2" />
                </Button>
                <Button size={"xs"} variant="secondary" onClick={() => handleClickResetFilters()}>
                  Limpar <EraserIcon size={12} className="ms-2" />
                </Button>
              </div>

              <AccordionTrigger className={`py-1 hover:no-underline`}>
                <span className="">Filtros</span>
              </AccordionTrigger>
              <AccordionContent className="p-0 pt-3">
                <ScrollArea className="whitespace-nowrap rounded-md pb-1 flex flex-wrap w-max max-w-full  ">
                  <div className="flex gap-2 sm:gap-3 w-max">
                    {!id_matriz && (
                      <SelectMatriz
                        showAll
                        value={filters.id_matriz}
                        onChange={(id_matriz) => {
                          setFilters({
                            id_matriz: id_matriz,
                          });
                        }}
                      />
                    )}
                    <Input
                      placeholder="Descrição"
                      className="w-[20ch]"
                      value={filters.descricao}
                      onChange={(e) => setFilters({ descricao: e.target.value })}
                    />
                    <Input
                      placeholder="Banco"
                      className="max-w-[200px]"
                      value={filters.banco}
                      onChange={(e) => setFilters({ banco: e.target.value })}
                    />
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogHeader>
        <ModalComponent
          isLoading={isLoading}
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
        >
          {data?.data?.rows.map((item: ItemContaBancariaProps, index: number) => (
            <ModalComponentRow key={`contasBancariasRow: ${item.id} ${index}`}>
              <>
                <span>
                  {item.grupo_economico && item.grupo_economico.toUpperCase()} -{" "}
                  {item.descricao && item.descricao.toUpperCase()} -{" "}
                  {item.banco && item.banco.toUpperCase()}
                </span>
                <Button
                  size={"xs"}
                  className="p-1"
                  variant={"outline"}
                  onClick={() => {
                    pushSelection(item);
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

export default ModalContasBancarias;
