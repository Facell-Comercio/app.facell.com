import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import fetchApi from "@/api/fetchApi";
import AlertPopUp from "@/components/custom/AlertPopUp";
import { Input } from "@/components/custom/FormInput";
import { ModalComponent, ModalComponentRow } from "@/components/custom/ModalComponent";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { Accordion } from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import ModalTituloPagar from "../contas-pagar/titulos/titulo/Modal";
import { useStoreTitulo } from "../contas-pagar/titulos/titulo/store";

interface IModalTitulosAPagar {
  open: boolean;
  handleSelection: (item: TituloPagarProps) => void;
  onOpenChange: () => void;
  closeOnSelection?: boolean;

  id_filial?: string;
  alert_title?: string;
  alert_description?: string;
  initialFilters?: any;
}

interface Filters {
  id?: string;
  forma_pagamento_list?: string[];
  status_list?: string[];
  tipo_data?: string;
  range_data?: DateRange;
  descricao?: string;
  nome_user?: string;
  nome_fornecedor?: string;
  id_filial?: string;
  num_doc?: string;
}

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

export type TituloPagarProps = {
  id?: string;
  status?: string;
  created_at?: string;
  num_doc?: string;
  descricao?: string;
  valor?: string;
  filial?: string;
  id_matriz?: string;
  fornecedor?: string;
  cnpj_fornecedor?: string;
  solicitante?: string;
  forma_pagamento?: string;
};

const ModalTitulosAPagar = ({
  open,
  handleSelection,
  onOpenChange,
  closeOnSelection = true,
  alert_title,
  alert_description,
  initialFilters,
}: IModalTitulosAPagar) => {
  const defaultFilters: Filters = {
    id: "",
    tipo_data: "created_at",
    range_data: { from: undefined, to: undefined },
    descricao: "",
    nome_fornecedor: "",
    num_doc: "",

    ...initialFilters,
  };

  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [initialFilters]);

  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const {
    data,
    isLoading,
    isError,
    refetch: refetch,
  } = useQuery({
    queryKey: ["financeiro", "contas_pagar", "titulo", "lista", { filters, pagination }],
    queryFn: async () =>
      await fetchApi.financeiro.contas_pagar.titulos.getAll({
        filters,
        pagination,
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

      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      resolve(true);
    });
    refetch();
  }

  function pushSelection(item: TituloPagarProps) {
    handleSelection(item);
    closeOnSelection && onOpenChange();
  }

  const pageCount = (data && data.pageCount) || 0;

  const [itemOpen, setItemOpen] = useState<string>("item-1");
  const openModal = useStoreTitulo().openModal;
  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Lista de Titulos a Pagar</DialogTitle>
          <DialogDescription>Selecione um ao clicar no botão à direita.</DialogDescription>

          <Accordion
            type="single"
            collapsible
            value={itemOpen}
            onValueChange={(e) => setItemOpen(e)}
            className="p-2 border dark:border-slate-800 rounded-lg flex-1"
          >
            <AccordionItem value="item-1" className="relative border-0">
              <div className="flex gap-3 items-center absolute start-16 top-1">
                <Button size={"xs"} onClick={handleClickFilter}>
                  Aplicar <FilterIcon size={12} className="ms-2" />
                </Button>
                <Button size={"xs"} variant="secondary" onClick={handleClickResetFilters}>
                  Limpar <EraserIcon size={12} className="ms-2" />
                </Button>
              </div>

              <AccordionTrigger className={`py-1 hover:no-underline`}>
                <span className="">Filtros</span>
              </AccordionTrigger>

              <AccordionContent className="p-0 pt-3">
                <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
                  <div className="flex w-max space-x-3">
                    <Input
                      type="number"
                      placeholder="ID"
                      className="w-[80px]"
                      value={filters?.id}
                      onChange={(e) => {
                        setFilters((prev) => ({
                          ...prev,
                          id: e.target.value,
                        }));
                      }}
                      min={0}
                    />
                    <Input
                      placeholder="DOC"
                      className="w-[80px]"
                      value={filters?.num_doc}
                      onChange={(e) => {
                        setFilters((prev) => ({
                          ...prev,
                          num_doc: e.target.value,
                        }));
                      }}
                    />

                    <DatePickerWithRange
                      date={filters.range_data}
                      setDate={(date) => {
                        setFilters((prev) => ({
                          ...prev,
                          range_data: date,
                        }));
                      }}
                    />
                    <Input
                      className="max-w-[200px]"
                      value={filters?.nome_fornecedor}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, nome_fornecedor: e.target.value }))
                      }
                      placeholder="Nome Fornecedor..."
                    />
                    <Input
                      className="max-w-[200px]"
                      value={filters.descricao}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, descricao: e.target.value }))
                      }
                      placeholder="Descrição..."
                    />
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogHeader>

        <div className="flex gap-1 flex-col">
          <div className="grid grid-cols-[8ch_12ch_minmax(30ch,_1fr)_minmax(30ch,_1fr)_15ch_64px] w-full gap-2 px-2 py-1 bg-secondary rounded-md font-medium">
            <span>ID</span>
            <span>DATA</span>
            <span>FORNECEDOR</span>
            <span>DESCRIÇÃO</span>
            <span>VALOR</span>
            <span>AÇÃO</span>
          </div>
          <ModalComponent
            isLoading={isLoading}
            pageCount={pageCount}
            refetch={refetch}
            pagination={pagination}
            setPagination={setPagination}
            className="sm:max-w-[1000px] max-w-xl"
          >
            {data?.rows.map((item: TituloPagarProps) => (
              <ModalComponentRow key={"tituloPagarKey:" + item.id}>
                <>
                  <div className="grid grid-cols-[8ch_12ch_minmax(30ch,_1fr)_minmax(30ch,_1fr)_15ch] w-full gap-2">
                    <span className="text-primary" onClick={() => openModal({ id: item.id || "" })}>
                      {item.id}
                    </span>
                    <span>{normalizeDate(item.created_at || "")}</span>
                    <span className="truncate">{item?.fornecedor}</span>
                    <span className="truncate">{item.descricao}</span>
                    <span>{normalizeCurrency(item.valor)}</span>
                  </div>
                  {alert_title && alert_description ? (
                    <AlertPopUp
                      title={alert_title}
                      description={alert_description}
                      action={() => {
                        pushSelection(item);
                      }}
                    >
                      <Button size={"xs"} className="p-1 w-16" variant={"outline"}>
                        Selecionar
                      </Button>
                    </AlertPopUp>
                  ) : (
                    <Button
                      size={"xs"}
                      className="p-1 w-16"
                      variant={"outline"}
                      onClick={() => {
                        pushSelection(item);
                      }}
                    >
                      Selecionar
                    </Button>
                  )}
                </>
              </ModalComponentRow>
            ))}
          </ModalComponent>
        </div>

        <ModalTituloPagar />
      </DialogContent>
    </Dialog>
  );
};

export default ModalTitulosAPagar;
