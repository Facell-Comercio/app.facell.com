import { ModalComponent } from "@/components/custom/ModalComponent";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { normalizeCurrency, normalizeDate } from "@/helpers/mask";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";

interface IModalVencimentos {
  open: boolean;
  handleSelection: (item: VencimentosProps[]) => void;
  onOpenChange: () => void;
  id_matriz?: string;
  id_status?: string;
  initialFilters?: {
    [key: string]: any;
  };
}

export type VencimentosProps = {
  checked?: boolean;
  id?: string;
  id_vencimento: string;
  id_titulo: string;
  id_status?: string;
  status: string;
  previsao: string;
  nome_fornecedor: string;
  valor_total: string;
  valor_pago?: string;
  num_doc: string;
  descricao: string;
  filial: string;
  data_pagamento?: string;
  can_remove?: boolean;
};

interface Filters {
  id_vencimento?: string;
  id_titulo?: string;
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

const ModalVencimentos = ({
  open,
  handleSelection,
  onOpenChange,
  id_matriz,
  id_status,
  initialFilters,
}: IModalVencimentos) => {
  const [ids, setIds] = useState<string[]>([]);
  const [titulos, setTitulos] = useState<VencimentosProps[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });
  const defaultFilters: Filters = {
    id_vencimento: "",
    id_titulo: "",
    fornecedor: "",
    descricao: "",
    num_doc: "",
    id_filial: "",
  };

  const inputsRef = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [filters, setFilters] = useState(initialFilters);

  const setInputRef = (key: string, element: HTMLInputElement | null) => {
    if (inputsRef.current) inputsRef.current[key] = element;
  };

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["modal-vencimentos", id_matriz, id_status],
    staleTime: 0,
    queryFn: async () =>
      await api.get("financeiro/contas-a-pagar/titulo/vencimentos-bordero", {
        params: {
          filters: { ...filters, id_matriz, id_status },
          pagination,
        },
      }),
    enabled: open,
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, ...initialFilters }));
    refetch();
  }, [initialFilters]);

  async function handleClickFilter() {
    await new Promise((resolve) => {
      if (inputsRef.current) {
        setFilters((prev) => ({
          ...prev,
          id_vencimento: inputsRef.current["id_vencimento"]?.value || "",
          id_titulo: inputsRef.current["id_titulo"]?.value || "",
          fornecedor: inputsRef.current["fornecedor"]?.value || "",
          descricao: inputsRef.current["descricao"]?.value || "",
          num_doc: inputsRef.current["num_doc"]?.value || "",
        }));
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

  function handleRemoveAll() {
    setTitulos([]);
    setIds([]);
  }
  function handleSelectAll() {
    data?.data?.rows.forEach((item: VencimentosProps) => {
      const isAlreadyInVencimentos = titulos.some(
        (existingItem) => existingItem.id_vencimento === item.id_vencimento
      );

      if (!isAlreadyInVencimentos) {
        setTitulos((prevVencimentos) => [
          ...prevVencimentos,
          {
            id_vencimento: item.id_vencimento,
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

  function pushSelection(item: VencimentosProps) {
    setTitulos([
      ...titulos,
      {
        id_vencimento: item.id_vencimento,
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

  if (isError) return <p>Ocorreu um erro ao tentar buscar os vencimentos</p>;

  const pageCount = (data && data.data.pageCount) || 0;

  const ButtonSaveSelection = () => {
    return (
      <Button onClick={() => handleSelection(titulos)}>Salvar seleção</Button>
    );
  };

  const Info = () => {
    return (
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <Badge variant={"secondary"}>
            <p className="mr-1">Qtde: </p>
            {data?.data.rows.length}
          </Badge>
          <Badge variant={"secondary"}>
            <p className="mr-1">Valor Total: </p>
            {normalizeCurrency(
              data?.data.rows.reduce(
                (acc: number, titulo: VencimentosProps) =>
                  acc + +titulo.valor_total,
                0
              ) || 0
            )}
          </Badge>
        </div>
        {titulos.length > 0 && (
          <div className="flex items-center gap-3">
            Selecionado:
            <Badge variant={"default"}>
              <p className="mr-1">Qtde: </p>
              {titulos.length}
            </Badge>
            <Badge variant={"default"}>
              <p className="mr-1">Valor: </p>
              {normalizeCurrency(
                titulos?.reduce(
                  (acc: number, titulo: VencimentosProps) =>
                    acc + +titulo.valor_total,
                  0
                ) || 0
              )}
            </Badge>
          </div>
        )}
      </div>
    );
  };
  const [itemOpen, setItemOpen] = useState<string>("item-1");

  if (isLoading) return null;
  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Vencimentos a pagar</DialogTitle>
          <DialogDescription>
            Selecione ao clicar no botão à direita.
          </DialogDescription>
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
                <Button
                  size={"xs"}
                  variant="secondary"
                  onClick={() => handleClickResetFilters()}
                >
                  Limpar <EraserIcon size={12} className="ms-2" />
                </Button>
              </div>

              <AccordionTrigger className={`py-1 hover:no-underline`}>
                <span className="">Filtros</span>
              </AccordionTrigger>
              <AccordionContent className="p-0 pt-3">
                <ScrollArea className="whitespace-nowrap rounded-md pb-1 flex flex-wrap w-max max-w-full  ">
                  <div className="flex gap-1 sm:gap-2 w-max">
                    <Input
                      placeholder="ID Vencimento"
                      className="w-[20ch]"
                      ref={(el) => setInputRef("id_vencimento", el)}
                    />
                    <Input
                      placeholder="ID Título"
                      className="w-[20ch]"
                      ref={(el) => setInputRef("id_titulo", el)}
                    />
                    <Input
                      placeholder="Fornecedor"
                      className="max-w-[200px]"
                      ref={(el) => setInputRef("fornecedor", el)}
                    />
                    <Input
                      placeholder="Descrição"
                      className="w-[20ch]"
                      ref={(el) => setInputRef("descricao", el)}
                    />
                    <Input
                      placeholder="Nº Doc"
                      className="w-[20ch]"
                      ref={(el) => setInputRef("num_doc", el)}
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
        </DialogHeader>
        <ModalComponent
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
          multiSelection
          buttonSaveSelection={ButtonSaveSelection}
          info={Info}
          handleRemoveAll={handleRemoveAll}
          handleSelectAll={handleSelectAll}
        >
          <table className="w-full border p-1">
            <thead>
              <tr className="text-sm">
                <th className="p-1">ID</th>
                <th className="p-1">ID Título</th>
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
              {data?.data?.rows.map((item: VencimentosProps, index: number) => {
                const isSelected = ids.includes(item.id_titulo.toString());
                return (
                  <tr
                    key={"titulos:" + item.id_titulo + index}
                    className={`bg-secondary odd:bg-secondary/70 text-secondary-foreground justify-between mb-1 border rounded-md p-1 px-2 ${
                      isSelected &&
                      "bg-secondary/50 text-secondary-foreground/40"
                    }`}
                  >
                    <td className="text-xs text-nowrap p-1 text-center">
                      {" "}
                      {item.id_vencimento}
                    </td>
                    <td className="text-xs text-nowrap p-1 text-center">
                      {" "}
                      {item.id_titulo}
                    </td>
                    <td className="text-xs text-nowrap p-1">
                      {item.nome_fornecedor.slice(0, 20) +
                        (item.nome_fornecedor.length > 20 ? "..." : "")}
                    </td>
                    <td className="text-xs text-nowrap p-1">
                      {item.descricao.slice(0, 30) +
                        (item.descricao.length > 30 ? "..." : "")}
                    </td>
                    <td className="text-xs text-nowrap p-1 text-center">
                      {normalizeDate(item.previsao)}
                    </td>
                    <td className="text-xs text-nowrap p-1 text-center">
                      {item.num_doc}
                    </td>
                    <td className="text-xs text-nowrap p-1">
                      {normalizeCurrency(item.valor_total)}
                    </td>
                    <td className="text-xs text-nowrap p-1">{item.filial}</td>
                    <td className="text-center p-1">
                      <Button
                        size={"xs"}
                        className="p-1"
                        variant={"outline"}
                        onClick={() => {
                          pushSelection(item);
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
        </ModalComponent>
      </DialogContent>
    </Dialog>
  );
};

export default ModalVencimentos;