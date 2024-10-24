import { ModalComponent } from "@/components/custom/ModalComponent";
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
import { Filial } from "@/types/filial-type";
import { useQuery } from "@tanstack/react-query";
import { EraserIcon, FilterIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import ModalFiliais from "../../admin/components/ModalFiliais";
import { VencimentoCRSchemaProps } from "../contas-receber/titulos/titulo/form-data";

export interface VencimentoCRProps extends VencimentoCRSchemaProps {
  id_vencimento?: string;
  id_titulo?: string;
  id_matriz?: string;
  fornecedor?: string;
  descricao?: string;
  num_doc?: string;
  filial?: string;
  valor_pagar?: string;
}

interface IModalVencimentosCR {
  open: boolean;
  handleSelection?: (item: VencimentoCRProps) => void;
  handleMultiSelection?: (item: VencimentoCRProps[]) => void;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  id_matriz?: string;
  id_status?: string;
  multiSelection?: boolean;
  closeOnSelection?: boolean;
  initialFilters?: {
    [key: string]: any;
  };
}

interface Filters {
  id_titulo?: string;
  id_vencimento?: string;
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

const ModalVencimentosCR = ({
  open,
  handleSelection,
  handleMultiSelection,
  onOpenChange,
  closeOnSelection,
  id_matriz,
  id_status,
  initialFilters,
  multiSelection,
}: IModalVencimentosCR) => {
  const [ids, setIds] = useState<string[]>([]);
  const [vencimentos, setVencimentos] = useState<VencimentoCRProps[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });
  const defaultFilters: Filters = {
    id_vencimento: "",
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
    queryKey: [
      "financeiro",
      "contas_receber",
      "titulo",
      "vencimentos",
      "lista",
      { id_matriz, id_status, filters },
    ],
    staleTime: 0,
    queryFn: async () =>
      await api
        .get(`/financeiro/contas-a-receber/titulo/vencimentos`, {
          params: {
            filters: { ...filters, id_matriz, id_status },
            pagination,
          },
        })
        .then((response) => response.data),

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
    setVencimentos([]);
    setIds([]);
  }
  function handleSelectAll() {
    data?.rows.forEach((item: VencimentoCRProps) => {
      const isAlreadyInVencimentosCR = ids.some((id) => id === item.id);

      if (!isAlreadyInVencimentosCR) {
        setVencimentos((prevVencimentosCR) => [
          ...prevVencimentosCR,
          {
            ...item,
          },
        ]);

        setIds((prevIds) => [...prevIds, item.id || ""]);
      }
    });
  }

  function pushSelection(item: VencimentoCRProps) {
    if (multiSelection) {
      const isAlreadyInVencimentosCR = ids.some((id) => id === item.id);

      if (!isAlreadyInVencimentosCR) {
        setVencimentos([
          ...vencimentos,
          {
            ...item,
          },
        ]);
        setIds([...ids, item.id || ""]);
      } else {
        setVencimentos((prevTitulos) =>
          prevTitulos.filter((vencimento) => vencimento.id !== item.id)
        );

        setIds((prevId) =>
          prevId.filter((id) => {
            return id !== item.id || "";
          })
        );
      }
    } else {
      handleSelection && handleSelection(item);
      if (onOpenChange !== undefined && closeOnSelection) {
        onOpenChange(false);
      }
    }
  }

  if (isError) return <p>Ocorreu um erro ao tentar buscar os vencimentos</p>;

  const pageCount = data?.pageCount || 0;

  const ButtonSaveSelection = () => {
    return (
      <Button onClick={() => handleMultiSelection && handleMultiSelection(vencimentos)}>
        Salvar seleção
      </Button>
    );
  };

  const Info = () => {
    return (
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <Badge variant={"secondary"}>
            <p className="mr-1">Qtde: </p>
            {data?.rows.length}
          </Badge>
          <Badge variant={"secondary"}>
            <p className="mr-1">Valor Total: </p>
            {normalizeCurrency(
              data?.rows.reduce(
                (acc: number, vencimento: VencimentoCRProps) => acc + parseFloat(vencimento.valor),
                0
              ) || 0
            )}
          </Badge>
        </div>
        {vencimentos.length > 0 && (
          <div className="flex items-center gap-3">
            Selecionado:
            <Badge variant={"default"}>
              <p className="mr-1">Qtde: </p>
              {vencimentos.length}
            </Badge>
            <Badge variant={"default"}>
              <p className="mr-1">Valor: </p>
              {normalizeCurrency(
                vencimentos?.reduce(
                  (acc: number, vencimento: VencimentoCRProps) => acc + +vencimento.valor,
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
  const [modalFilialOpen, setModalFilialOpen] = useState<boolean>(false);
  const [filial, setFilial] = useState<string>("");

  function handleSelectFilial(filial: Filial) {
    setFilters({ ...filters, id_filial: filial.id });
    setFilial(filial.nome);
  }

  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Vencimentos a receber</DialogTitle>
          <DialogDescription>Selecione ao clicar no botão à direita.</DialogDescription>
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
                    <Input
                      placeholder="ID"
                      className="w-[10ch]"
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
                    <Input
                      placeholder="Filial"
                      className="w-[30ch]"
                      readOnly
                      value={filial}
                      onClick={() => setModalFilialOpen(true)}
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
          multiSelection={multiSelection}
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
              {data?.rows.map((item: VencimentoCRProps, index: number) => {
                const isSelected = ids.includes(item.id || "");

                return (
                  <tr
                    key={"vencimentos:" + item.id_vencimento + index}
                    className={`bg-secondary odd:bg-secondary/70 text-secondary-foreground justify-between mb-1 border rounded-md p-1 px-2 ${
                      isSelected && "bg-secondary/50 text-secondary-foreground/40"
                    }`}
                  >
                    <td className="text-xs text-nowrap p-1 text-center"> {item.id}</td>
                    <td className="text-xs text-nowrap p-1 text-center">{item.id_titulo}</td>
                    <td className="text-xs text-nowrap p-1">
                      {item.fornecedor &&
                        item.fornecedor.slice(0, 20) +
                          (item.fornecedor && item.fornecedor.length > 20 ? "..." : "")}
                    </td>
                    <td className="text-xs text-nowrap p-1">
                      {item.descricao &&
                        item.descricao.slice(0, 30) +
                          (item.descricao && item.descricao.length > 30 ? "..." : "")}
                    </td>
                    <td className="text-xs text-nowrap p-1 text-center">
                      {normalizeDate(item.data_vencimento)}
                    </td>
                    <td className="text-xs text-nowrap p-1 text-center">{item.num_doc}</td>
                    <td className="text-xs text-nowrap p-1">{normalizeCurrency(item.valor)}</td>
                    <td className="text-xs text-nowrap p-1">{item.filial}</td>
                    <td className="text-center p-1">
                      <Button
                        size={"xs"}
                        className={`p-1 ${
                          isSelected && "bg-secondary hover:bg-secondary hover:opacity-90"
                        }`}
                        variant={"outline"}
                        onClick={() => pushSelection(item)}
                      >
                        {isSelected ? "Desmarcar" : "Selecionar"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ModalComponent>
        <ModalFiliais
          open={modalFilialOpen}
          handleSelection={handleSelectFilial}
          onOpenChange={setModalFilialOpen}
          id_matriz={id_matriz}
          closeOnSelection
        />
      </DialogContent>
    </Dialog>
  );
};

export default ModalVencimentosCR;
