import AlertPopUp from "@/components/custom/AlertPopUp";
import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
import MultiSelectWithLabel from "@/components/custom/MultiSelectWithLabel";
import { SelectMultiCargosComissao } from "@/components/custom/SelectCargosComissao";
import { SelectMultiFilial } from "@/components/custom/SelectFilial";
import SelectMes from "@/components/custom/SelectMes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEspelhos } from "@/hooks/comercial/useEspelhos";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { Calculator, EraserIcon, FilterIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

const ButtonCalcularEspelho = () => {
  const [modalCalculoComissionamentoOpen, setModalCalculoComissionamentoOpen] = useState(false);
  return (
    <>
      <Button
        variant={"outline"}
        className="border-violet-400 dark:border-violet-800 hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={() => setModalCalculoComissionamentoOpen(true)}
      >
        <Calculator className="me-2" size={18} /> Calcular
      </Button>
      <ModalCalculoComissionamento
        open={modalCalculoComissionamentoOpen}
        onOpenChange={() => setModalCalculoComissionamentoOpen(false)}
        multiSelection
      />
    </>
  );
};

export default ButtonCalcularEspelho;

export type MetasAgregadoresProps = {
  id?: string;
  nome?: string;
  cargo?: string;
  cpf?: string;
  id_filial?: string;
  filial?: string;
  ref?: string;
  tipo?: string;
};

interface IModalCalculoComissionamento {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;

  handleSelection?: (item: MetasAgregadoresProps) => void;
  handleMultiSelection?: (item: MetasAgregadoresProps[]) => void;
  id_matriz?: string;
  multiSelection?: boolean;
  closeOnSelection?: boolean;
  initialFilters?: {
    [key: string]: any;
  };
}

interface Filters {
  grupo_economico?: string;
  mes?: string;
  ano?: string;
  tipo_meta?: string;
  status_list?: string[];
  filial_list?: string[];
  cargo_list?: string[];
}

const ModalCalculoComissionamento = ({
  open,
  onOpenChange,
  handleSelection,
  closeOnSelection,
  initialFilters,
  multiSelection,
}: IModalCalculoComissionamento) => {
  const [ids, setIds] = useState<string[]>([]);
  const [metas, setMetas] = useState<MetasAgregadoresProps[]>([]);
  const defaultFilters: Filters = {
    grupo_economico: "",
    tipo_meta: "all",
    mes: String(new Date().getMonth() + 1),
    ano: String(new Date().getFullYear()),
    status_list: [],
    filial_list: [],
    cargo_list: [],
  };

  function handleRemoveAll() {
    setMetas([]);
    setIds([]);
  }

  const [filters, setFilters] = useState({
    ...defaultFilters,
    ...initialFilters,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["comercial", "comissionamento", "espelhos", "metas-agreagadores", "lista", filters],
    queryFn: async () =>
      await api
        .get("/comercial/comissionamento/espelhos/metas-agregadores", { params: { filters } })
        .then((res) => res.data),
    enabled: open,
  });
  const { mutate: calcularComissionamento, isPending: calcularComissionamentoIsPending } =
    useEspelhos().calcularComissionamento();

  const rows = data?.rows || [];
  const totalRows = (data && data?.rows.length) || 0;
  const status_list = ["pendente", "calculado", "erro"];

  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());

  useEffect(() => {
    if (filters.mes !== String(mes)) {
      setMes(parseFloat(filters.mes || "0"));
    }
    if (filters.ano !== String(ano)) {
      setAno(parseFloat(filters.ano || "0"));
    }
  }, [filters]);

  useEffect(() => {
    if (open) {
      setFilters((prev) => ({ ...prev, ...initialFilters }));
      refetch();
    }
  }, [initialFilters]);

  async function handleClickFilter() {
    refetch();
  }

  async function handleClickResetFilters() {
    await new Promise((resolve) => {
      setFilters((prev) => ({ ...prev, ...initialFilters, ...defaultFilters }));
      resolve(true);
    });
    refetch();
  }

  function pushSelection(item: MetasAgregadoresProps) {
    if (multiSelection) {
      const isAlreadyInMetas = ids.some((id) => id === `${item.id}-${item.tipo}`);

      if (!isAlreadyInMetas) {
        setMetas((prev) => [
          ...prev,
          {
            ...item,
          },
        ]);

        setIds([...ids, `${item.id}-${item.tipo}`]);
      } else {
        setMetas((prevMetas) =>
          prevMetas.filter((meta) => `${meta.id}-${meta.tipo}` !== `${item.id}-${item.tipo}`)
        );

        setIds((prevId) =>
          prevId.filter((id) => {
            return id !== `${item.id}-${item.tipo}`;
          })
        );
      }
    } else {
      handleSelection && handleSelection(item);
      if (closeOnSelection) {
        onOpenChange(false);
      }
    }
  }

  const [itemOpen, setItemOpen] = useState<string>("item-1");

  useEffect(() => {
    if (!open) {
      handleRemoveAll();
    }
  }, [open]);

  useEffect(() => {
    handleRemoveAll();
  }, [mes, ano]);

  const columns = useMemo<ColumnDef<MetasAgregadoresProps>[]>(
    () => [
      {
        id: "select",
        accessorKey: "id",

        header: () => (
          <div className="px-1 ">
            <Checkbox
              disabled={calcularComissionamentoIsPending}
              className="bg-background border-background h-4 w-4 rounded-sm"
              checked={ids.length === totalRows || (ids.length > 0 && "indeterminate")}
              onCheckedChange={(value) => {
                handleRemoveAll();
                for (const row of rows) {
                  if (value) {
                    setIds((prev) => [...prev, `${row.id}-${row.tipo}`]);
                    setMetas((prev) => [...prev, row]);
                  }
                }
              }}
            />
          </div>
        ),
        cell: ({ row }) => {
          const original = row.original;
          return (
            <div className="flex items-center">
              <Checkbox
                disabled={calcularComissionamentoIsPending}
                className="bg-background border-background h-4 w-4 rounded-sm"
                {...{
                  checked: ids.includes(`${original.id}-${original.tipo}`),
                  onCheckedChange: () => pushSelection(original),
                }}
              />
            </div>
          );
        },
        size: 30,
        enableSorting: false,
      },
      {
        accessorKey: "status_espelho",
        header: "STATUS",
        cell: (info) => {
          let value = info.getValue<string>();
          let color = "";
          if (value === "calculado") {
            color = "text-green-500";
          }
          if (value === "erro") {
            color = "text-red-500";
          }
          return <div className={`w-full text-center uppercase ${color}`}>{value}</div>;
        },
        size: 100,
      },
      {
        accessorKey: "ref",
        header: "REF",
        size: 100,
        cell: (info) => {
          let value = formatDate(info.getValue<Date>(), "dd/MM/yyyy");
          return <div className="w-full text-center">{value}</div>;
        },
      },
      {
        accessorKey: "filial",
        header: "FILIAL",
        size: 150,
        cell: (info) => {
          let value = info.getValue<string>();
          return <div className={`w-full px-2 uppercase truncate`}>{value}</div>;
        },
      },
      {
        accessorKey: "cargo",
        header: "CARGO",
        size: 200,
        cell: (info) => {
          let value = info.getValue<string>();
          return <div className={`w-full px-2 uppercase truncate`}>{value}</div>;
        },
      },
      {
        accessorKey: "nome",
        header: "NOME",
        size: 200,
        cell: (info) => {
          let value = info.getValue<string>();
          return <div className={`w-full px-2 uppercase truncate`}>{value}</div>;
        },
      },
      {
        accessorKey: "obs_espelho",
        header: "OBSERVAÇÃO",
        cell: (info) => {
          let value = info.getValue<string>();
          return <div className={`w-full px-2 truncate`}>{value || "-"}</div>;
        },
        size: 200,
      },
    ],
    [data, ids]
  );

  function recalcular() {
    const metasMap = new Map();

    for (const item of metas) {
      const metaAnterior = metasMap.get(item.tipo) || [];
      metasMap.set(item.tipo, [metaAnterior, { id: item.id }].flat());
    }

    const obj = {
      ciclo: formatDate(new Date(ano, mes - 1, 1), "yyyy-MM-dd"),
      metas: metasMap.get("meta") || [],
      agregadores: metasMap.get("agregador") || [],
    };

    calcularComissionamento(obj);
  }

  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Cálculo de Comissionamento</DialogTitle>
          <DialogDescription>Selecione ao clicar no botão.</DialogDescription>
          <Accordion
            type="single"
            collapsible
            value={itemOpen}
            onValueChange={(e) => setItemOpen(e)}
            className="p-2 border dark:border-slate-800 rounded-lg flex-1"
          >
            <AccordionItem value="item-1" className="relative border-0">
              <div className="flex gap-3 items-center absolute start-16 topy-1 px-1.">
                <Button
                  size={"xs"}
                  onClick={() => handleClickFilter()}
                  disabled={calcularComissionamentoIsPending}
                >
                  Aplicar <FilterIcon size={12} className="ms-2" />
                </Button>
                <Button
                  size={"xs"}
                  variant="secondary"
                  onClick={() => handleClickResetFilters()}
                  disabled={calcularComissionamentoIsPending}
                >
                  Limpar <EraserIcon size={12} className="ms-2" />
                </Button>
              </div>

              <AccordionTrigger className={`py-1 hover:no-underline`}>
                <span className="">Filtros</span>
              </AccordionTrigger>
              <AccordionContent className="p-0 pt-1">
                <ScrollArea className="whitespace-nowrap rounded-md pb-1 flex flex-wrap w-max max-w-full  ">
                  <div className="flex gap-2 sm:gap-3 w-max items-end p-1">
                    <span className="flex flex-col gap-1">
                      <label className="text-sm font-semibold">Grupo Econômico</label>
                      <Select
                        value={filters?.grupo_economico || ""}
                        onValueChange={(grupo_economico) =>
                          setFilters((prev) => ({
                            ...prev,
                            grupo_economico: grupo_economico,
                            filial_list: [],
                          }))
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Grupo Econômico" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FACELL">FACELL</SelectItem>
                          <SelectItem value="FORTTELECOM">FORTTELECOM</SelectItem>
                        </SelectContent>
                      </Select>
                    </span>
                    <span className="flex flex-col gap-1">
                      <label className="text-sm font-semibold">Mês Ciclo</label>
                      <SelectMes
                        value={filters.mes}
                        onValueChange={(mes) => setFilters((prev) => ({ ...prev, mes: mes }))}
                        className="w-[120px]"
                      />
                    </span>
                    <span className="flex flex-col gap-1">
                      <label className="text-sm font-semibold">Ano</label>
                      <Input
                        value={filters.ano}
                        onChange={(e) => setFilters((prev) => ({ ...prev, ano: e.target.value }))}
                        className="w-[12ch]"
                        type="number"
                        min={2023}
                      />
                    </span>
                    <span className="flex flex-col gap-1">
                      <label className="text-sm font-semibold">Tipo de Meta</label>
                      <Select
                        value={filters.tipo_meta}
                        onValueChange={(tipo_meta) => {
                          setFilters((prev) => ({ ...prev, tipo_meta: tipo_meta }));
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">TODAS</SelectItem>
                          <SelectItem value="meta">META</SelectItem>
                          <SelectItem value="agregador">AGREGADOR</SelectItem>
                        </SelectContent>
                      </Select>
                    </span>
                    <MultiSelectWithLabel
                      label="Status"
                      options={status_list.map((status: any) => ({
                        value: status,
                        label: status.toUpperCase(),
                      }))}
                      onValueChange={(status_list) => {
                        setFilters((prev) => ({ ...prev, status_list: status_list }));
                      }}
                      defaultValue={filters.status_list || []}
                      placeholder="Status"
                      variant="secondary"
                      animation={4}
                      maxCount={2}
                      maxCharacters={25}
                      className={`bg-background hover:bg-background`}
                    />
                    <span className="flex flex-col gap-1">
                      <label className="text-sm font-semibold">Filiais</label>
                      <SelectMultiFilial
                        className="max-w-full w-full min-w-[20ch] flex-nowrap"
                        value={filters.filial_list || []}
                        onChange={(value) => {
                          setFilters((prev) => ({ ...prev, filial_list: value }));
                          refetch();
                        }}
                        grupo_economico={filters.grupo_economico}
                        maxCount={2}
                        nowrap
                        isLojaTim
                      />
                    </span>
                    <span className="flex flex-col gap-1">
                      <label className="text-sm font-semibold">Cargos</label>
                      <SelectMultiCargosComissao
                        value={filters.cargo_list || []}
                        onChange={(cargo_list) => {
                          setFilters((prev) => ({ ...prev, cargo_list: cargo_list }));
                        }}
                        tipo={filters.tipo_meta || ""}
                      />
                    </span>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogHeader>

        <DataVirtualTableHeaderFixed
          data={rows}
          // @ts-ignore
          columns={columns}
          divClassName="border"
          variant="secondary"
          className="min-h-[350px] max-h-[50vh]"
          isLoading={isLoading}
        />
        <DialogFooter>
          <AlertPopUp
            title="Deseja realizar o cálculo?"
            description="Essa ação não pode ser desfeita. As metas e agregadores selecionados serão recalculados."
            action={recalcular}
          >
            <span title={ids.length === 0 ? "Selecione no mínimo 1 item" : ""}>
              <Button disabled={calcularComissionamentoIsPending || !ids.length}>
                {/* <Calculator className="me-2" /> */}
                Calcular {ids.length > 0 && `(${ids.length} Espelho${ids.length > 1 ? "s" : ""})`}
              </Button>
            </span>
          </AlertPopUp>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
