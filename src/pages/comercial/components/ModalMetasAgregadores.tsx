import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { normalizeDate } from "@/helpers/mask";
import { api } from "@/lib/axios";
import { Filial } from "@/types/filial-type";
import { useQuery } from "@tanstack/react-query";
import { EraserIcon, FilterIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalFiliais from "../../admin/components/ModalFiliais";

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

interface IModalMetasAgregadores {
  open: boolean;
  handleSelection?: (item: MetasAgregadoresProps) => void;
  handleMultiSelection?: (item: MetasAgregadoresProps[]) => void;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  id_matriz?: string;
  multiSelection?: boolean;
  closeOnSelection?: boolean;
  initialFilters?: {
    [key: string]: any;
  };
}

interface Filters {
  nome?: string;
  cargo?: string;
  cpf?: string;
  id_filial?: string;
  id_grupo_economico?: string;
}

const ModalMetasAgregadores = ({
  open,
  handleSelection,
  onOpenChange,
  closeOnSelection,
  initialFilters,
  multiSelection,
}: IModalMetasAgregadores) => {
  const [ids, setIds] = useState<string[]>([]);
  const [metas, setColaboradores] = useState<MetasAgregadoresProps[]>([]);
  const defaultFilters: Filters = {
    nome: "",
    id_grupo_economico: "",
    id_filial: "",
    cargo: "",
    cpf: "",
  };

  const [filters, setFilters] = useState({
    ...defaultFilters,
    ...initialFilters,
  });

  const { data, isError, refetch } = useQuery({
    queryKey: ["comercial", "metas-agreagadores", "lista"],
    staleTime: 0,
    queryFn: async () =>
      await api
        .get("/comercial/metas-agregadores", { params: { filters } })
        .then((res) => res.data),
    enabled: open,
  });

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
      setFilters((prev) => ({ ...prev, ...defaultFilters, ...initialFilters }));
      resolve(true);
    });
    refetch();
  }

  function handleRemoveAll() {
    setColaboradores([]);
    setIds([]);
  }

  function pushSelection(item: MetasAgregadoresProps) {
    if (multiSelection) {
      const isAlreadyInMetas = ids.some((id) => id === `${item.id}-${item.tipo}`);

      if (!isAlreadyInMetas) {
        setColaboradores([
          ...metas,
          {
            ...item,
          },
        ]);

        setIds([...ids, `${item.id}-${item.tipo}`]);
      } else {
        setColaboradores((prevMetas) =>
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
      if (onOpenChange !== undefined && closeOnSelection) {
        onOpenChange(false);
      }
    }
  }

  const [itemOpen, setItemOpen] = useState<string>("item-1");
  const [modalFilialOpen, setModalFilialOpen] = useState<boolean>(false);
  const [filial, setFilial] = useState<string>("");

  function handleSelectFilial(filial: Filial) {
    setFilters((prev) => ({ ...prev, id_filial: filial.id }));
    setFilial(filial.nome);
  }
  useEffect(() => {
    if (!open) {
      handleRemoveAll();
    }
  }, [open]);

  if (isError) return null;
  if (!open) return null;
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Metas & Agregadores</DialogTitle>
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
                      placeholder="Nome"
                      className="max-w-[24ch]"
                      value={filters?.nome || ""}
                      onChange={(e) => {
                        setFilters((prev) => ({ ...prev, nome: e.target.value }));
                      }}
                    />
                    <Select
                      value={filters?.id_grupo_economico || ""}
                      onValueChange={(id_grupo_economico) => {
                        setFilters((prev) => ({
                          ...prev,
                          id_grupo_economico: id_grupo_economico,
                          id_filial: "",
                        }));
                        setFilial("");
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Grupo Econômico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">FACELL</SelectItem>
                        <SelectItem value="9">FORTTELECOM</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Filial"
                      className="w-[30ch]"
                      readOnly
                      value={filial}
                      onClick={() => setModalFilialOpen(true)}
                    />
                    <Input
                      placeholder="Cargo"
                      className="max-w-[200px]"
                      value={filters?.cargo || ""}
                      onChange={(e) => {
                        setFilters((prev) => ({ ...prev, cargo: e.target.value }));
                      }}
                    />
                    <Input
                      placeholder="CPF"
                      className="max-w-[200px]"
                      value={filters?.cpf || ""}
                      onChange={(e) => {
                        setFilters((prev) => ({ ...prev, cpf: e.target.value }));
                      }}
                    />
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogHeader>

        <Table className="w-full" divClassname="border rounded-md min-h-[40ch] max-h-[40vh]">
          <TableHeader>
            <TableRow className="text-sm">
              <TableHead className="py-1 px-1.5 w-6">Ação</TableHead>
              <TableHead className="py-1 px-1.5 text-nowrap">Tipo</TableHead>
              <TableHead className="py-1 px-1.5 text-nowrap">Ref</TableHead>
              <TableHead className="py-1 px-1.5 text-nowrap">Filial</TableHead>
              <TableHead className="py-1 px-1.5 text-nowrap">Cargo</TableHead>
              <TableHead className="py-1 px-1.5 text-nowrap">CPF</TableHead>
              <TableHead className="py-1 px-1.5 text-nowrap">Nome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((item: MetasAgregadoresProps, index: number) => {
                const isSelected = ids.includes(item.id || "");

                return (
                  <TableRow
                    key={"metas-agregadores:" + item.id + index}
                    className={`bg-secondary odd:bg-secondary/70 text-secondary-foreground justify-between mb-1 border rounded-md py-1 px-1. px-2 ${
                      isSelected &&
                      "bg-primary/80 odd:bg-primary/90 border-transparent text-primary-foreground/40 opacity-70"
                    }`}
                    onClick={() => {
                      pushSelection(item);
                    }}
                  >
                    <TableCell className="text-center py-1 px-1.5">
                      <Button
                        size={"xs"}
                        className={`py-1 px-1.5 ${
                          isSelected && "bg-secondary hover:bg-secondary hover:opacity-90"
                        }`}
                        variant={"outline"}
                      >
                        {isSelected ? "Desmarcar" : "Selecionar"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-xs text-nowrap py-1 px-1.5 uppercase">
                      {item.tipo}
                    </TableCell>
                    <TableCell className="text-xs text-nowrap py-1 px-1.5 text-center">
                      {normalizeDate(item.ref || "")}
                    </TableCell>
                    <TableCell className="text-xs text-nowrap py-1 px-1.5">{item.filial}</TableCell>
                    <TableCell className="text-xs text-nowrap py-1 px-1.5">{item.cargo}</TableCell>
                    <TableCell className="text-xs text-nowrap py-1 px-1.5">{item.cpf}</TableCell>
                    <TableCell className="text-xs text-nowrap py-1 px-1.5">{item.nome}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <ModalFiliais
          open={modalFilialOpen}
          handleSelection={handleSelectFilial}
          onOpenChange={setModalFilialOpen}
          closeOnSelection
          id_grupo_economico={filters?.id_grupo_economico}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ModalMetasAgregadores;
