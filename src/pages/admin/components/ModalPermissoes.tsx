import { DataVirtualTableHeaderFixed } from "@/components/custom/DataVirtualTableHeaderFixed";
import { InputWithLabel } from "@/components/custom/FormInput";
import MultiSelectWithLabel from "@/components/custom/MultiSelectWithLabel";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePermissao } from "@/hooks/adm/usePermissao";
import { api } from "@/lib/axios";
import { Permissao } from "@/types/permissao-type";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { EraserIcon, FilterIcon } from "lucide-react";
import { useState } from "react";

interface IModalPermissoes {
  open: boolean;
  handleSelection: (item: Permissao) => void;
  onOpenChange: (value: boolean) => void;
  closeOnSelection?: boolean;
}

type FilterProps = {
  nome?: string;
  modulo_list?: string[];
};

const initialFilter = {
  nome: "",
  modulo_list: [],
};

const ModalPermissoes = ({
  open,
  handleSelection,
  onOpenChange,
  closeOnSelection,
}: IModalPermissoes) => {
  const [filters, setFilters] = useState<FilterProps>(initialFilter);

  const { data, isError, refetch } = usePermissao().getAll({
    filters,
  });

  const { data: modulosData } = useQuery({
    queryKey: ["adm", "modulos", "lista"],
    queryFn: async () => await api.get("/adm/modulos").then((response) => response.data),
    staleTime: Infinity,
  });
  const rows = data?.rows || [];
  const modulos = modulosData?.rows || [];

  async function handleClickFilter() {
    await new Promise((resolve) => {
      resolve(true);
    });
    refetch();
  }

  async function handleClickResetFilters() {
    await new Promise((resolve) => {
      setFilters(initialFilter);
      resolve(true);
    });
    refetch();
  }

  function pushSelection(item: Permissao) {
    if (closeOnSelection) {
      // @ts-expect-error 'vai funcionar...'
      onOpenChange();
    }

    handleSelection(item);
  }

  const [itemOpen, setItemOpen] = useState<string>("item-1");

  const columns: ColumnDef<Permissao>[] = [
    {
      id: "id",
      header: "AÇÃO",
      size: 80,
      cell: (info) => {
        const item = info.row.original;

        return (
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
        );
      },
    },
    {
      accessorKey: "modulo",
      header: "MÓDULO",
      size: 200,
      cell: (info) => <div className="w-full uppercase">{info.getValue<string>() || "-"}</div>,
    },
    {
      accessorKey: "nome",
      header: "PERMISSÃO",
      size: 400,
      cell: (info) => (
        <div className="w-full uppercase">
          {info.getValue<string>().replace(":", ": ").replaceAll("_", " ")}
        </div>
      ),
    },
  ];

  if (isError) return null;
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Lista de Permissões</DialogTitle>
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
              <AccordionContent className="p-0 pt-1">
                <ScrollArea className="whitespace-nowrap rounded-md pb-1 flex flex-wrap w-max max-w-full  ">
                  <div className="flex gap-2 sm:gap-3 w-max">
                    <InputWithLabel
                      label="Permissão"
                      placeholder="Permissão"
                      className="min-w-[40ch]"
                      value={filters?.nome || ""}
                      onChange={(e) => setFilters((prev) => ({ ...prev, nome: e.target.value }))}
                    />
                    <MultiSelectWithLabel
                      label="Módulos"
                      options={modulos.map((modulo: any) => ({
                        value: modulo.nome,
                        label: modulo.nome.toUpperCase(),
                      }))}
                      onValueChange={(modulo_list) => {
                        setFilters((prev) => ({ ...prev, modulo_list: modulo_list }));
                      }}
                      defaultValue={filters?.modulo_list || []}
                      placeholder="Modulo"
                      variant="secondary"
                      animation={4}
                      maxCount={2}
                      maxCharacters={25}
                      className={`bg-background hover:bg-background`}
                    />
                  </div>
                  <Scrollbar orientation="horizontal" />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogHeader>

        <DataVirtualTableHeaderFixed
          variant="secondary"
          // @ts-ignore
          columns={columns}
          data={rows}
          className={`h-[300px] bg-background`}
          headerTextPosition="left"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ModalPermissoes;
