import {
  ModalComponent,
  ModalComponentRow,
} from "@/components/custom/ModalComponent";
import SelectGrupoEconomico from "@/components/custom/SelectGrupoEconomico";
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
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
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
}

export type ItemContaBancariaProps = {
  id: string;
  grupo_economico: string;
  descricao: string;
  banco: string;
  id_matriz: string;
  id_grupo_economico?: string;
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
  handleSelection,
  onOpenChange,
  closeOnSelection,
  id_matriz,
  id_grupo_economico,
}: IModalContaBancaria) => {
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });

  const defaultFilters: Filters = {
    id_grupo_economico: "",
    descricao: "",
    banco: "",
  };
  const inputsRef = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [filters, setFilters] = useState(defaultFilters);
  const setInputRef = (key: string, element: HTMLInputElement | null) => {
    if (inputsRef.current) inputsRef.current[key] = element;
  };

  const { data, isLoading, isError, refetch } = useQuery({
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

  async function handleClickFilter() {
    await new Promise((resolve) => {
      if (inputsRef.current) {
        setFilters((prev) => ({
          ...prev,
          descricao: inputsRef.current["descricao"]?.value || "",
          banco: inputsRef.current["banco"]?.value || "",
        }));
        console.log(filters);
      }
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

  if (isLoading) return null;
  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Contas bancárias</DialogTitle>
          <DialogDescription>
            Selecione uma ao clicar no botão à direita.
          </DialogDescription>

          <Accordion
            type="single"
            collapsible
            value={itemOpen}
            onValueChange={(e) => setItemOpen(e)}
            className="p-2 border dark:border-slate-800 rounded-lg flex-1"
          >
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger className="pb-2 hover:no-underline w-full text-left text-slate-500">
                Filtros
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <ScrollArea className="w-fill whitespace-nowrap rounded-md pb-4">
                  <div className="flex w-max space-x-4">
                    <Button size={"sm"} onClick={() => handleClickFilter()}>
                      Filtrar <FilterIcon size={12} className="ms-2" />
                    </Button>
                    <Button
                      size={"sm"}
                      onClick={() => handleClickResetFilters()}
                      variant="secondary"
                    >
                      Limpar <EraserIcon size={12} className="ms-2" />
                    </Button>

                    {!id_grupo_economico && (
                      <SelectGrupoEconomico
                        showAll
                        value={filters.id_grupo_economico}
                        onChange={(id_grupo_economico) => {
                          setFilters({
                            id_grupo_economico: id_grupo_economico,
                          });
                        }}
                      />
                    )}
                    <Input
                      placeholder="Descrição"
                      className="w-[20ch]"
                      ref={(el) => setInputRef("descricao", el)}
                    />
                    <Input
                      placeholder="Banco"
                      className="max-w-[200px]"
                      ref={(el) => setInputRef("banco", el)}
                    />
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogHeader>
        <ModalComponent
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
        >
          {data?.data?.rows.map(
            (item: ItemContaBancariaProps, index: number) => (
              <ModalComponentRow
                key={"contasBancariasRow:" + item.id + index}
                componentKey={"contasBancarias:" + item.id + index}
              >
                <>
                  <span>
                    {item.grupo_economico && item.grupo_economico.toUpperCase()}{" "}
                    - {item.descricao && item.descricao.toUpperCase()} -{" "}
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
            )
          )}
        </ModalComponent>
      </DialogContent>
    </Dialog>
  );
};

export default ModalContasBancarias;
