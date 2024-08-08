import fetchApi from "@/api/fetchApi";
import { ModalComponent } from "@/components/custom/ModalComponent";
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
import { normalizeDate, normalizePercentual } from "@/helpers/mask";
import { MetasProps } from "@/hooks/comercial/useMetas";
import { Filial } from "@/types/filial-type";
import { useQuery } from "@tanstack/react-query";
import { EraserIcon, FilterIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ModalFiliais from "../../admin/components/ModalFiliais";

interface IModalMetas {
  open: boolean;
  handleSelection?: (item: MetasProps) => void;
  handleMultiSelection?: (item: MetasProps[]) => void;
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

type PaginationProps = {
  pageSize: number;
  pageIndex: number;
};

const ModalMetas = ({
  open,
  handleSelection,
  handleMultiSelection,
  onOpenChange,
  closeOnSelection,
  initialFilters,
  multiSelection,
}: IModalMetas) => {
  const [ids, setIds] = useState<string[]>([]);
  const [metas, setMetas] = useState<MetasProps[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    pageSize: 15,
    pageIndex: 0,
  });
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

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["comercial", "metas", "lista", { pagination, filters }],
    staleTime: 0,
    queryFn: async () =>
      await fetchApi.comercial.metas.getAll({ pagination, filters }),
    enabled: open,
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, ...initialFilters }));
    refetch();
  }, [initialFilters]);

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

  function handleRemoveAll() {
    setMetas([]);
    setIds([]);
  }
  function handleSelectAll() {
    data?.rows.forEach((item: MetasProps) => {
      // const isAlreadyInMetas = metas.some(
      //   (existingItem) =>
      //     existingItem.id_vencimento === item.id_vencimento &&
      //     existingItem.id_forma_pagamento === item.id_forma_pagamento
      // );

      const isAlreadyInMetas = ids.some((id) => id === item.id);

      if (!isAlreadyInMetas) {
        setMetas((prevMetas) => [
          ...prevMetas,
          {
            ...item,
          },
        ]);

        setIds((prevIds) => [...prevIds, item.id || ""]);
      }
    });
  }

  function pushSelection(item: MetasProps) {
    if (multiSelection) {
      const isAlreadyInMetas = ids.some((id) => id === item.id);

      if (!isAlreadyInMetas) {
        setMetas([
          ...metas,
          {
            ...item,
          },
        ]);

        setIds([...ids, item.id || ""]);
      } else {
        setMetas((prevMetas) =>
          prevMetas.filter((meta) => meta.id !== item.id)
        );

        setIds((prevId) =>
          prevId.filter((id) => {
            return id !== item.id;
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

  if (isError) return <p>Ocorreu um erro ao tentar buscar os metas</p>;

  const pageCount = (data && data.pageCount) || 0;

  const ButtonSaveSelection = () => {
    return (
      <Button
        onClick={() => {
          handleMultiSelection && handleMultiSelection(metas);
          onOpenChange(false);
        }}
      >
        Salvar seleção
      </Button>
    );
  };

  // const Info = () => {
  //   return (
  //     <div className="flex items-center justify-between gap-3 text-sm">
  //       <div className="flex items-center gap-3">
  //         <Badge variant={"secondary"}>
  //           <p className="mr-1">Qtde: </p>
  //           {data.rows.length}
  //         </Badge>
  //         <Badge variant={"secondary"}>
  //           <p className="mr-1">Valor Total: </p>
  //           {normalizeCurrency(
  //             data.rows.reduce(
  //               (acc: number, meta: MetasProps) =>
  //                 acc + parseFloat(meta.valor_total),
  //               0
  //             ) || 0
  //           )}
  //         </Badge>
  //       </div>
  //       {metas.length > 0 && (
  //         <div className="flex items-center gap-3">
  //           Selecionado:
  //           <Badge variant={"default"}>
  //             <p className="mr-1">Qtde: </p>
  //             {metas.length}
  //           </Badge>
  //           <Badge variant={"default"}>
  //             <p className="mr-1">Valor: </p>
  //             {normalizeCurrency(
  //               metas?.reduce(
  //                 (acc: number, meta: MetasProps) =>
  //                   acc + +meta.valor_total,
  //                 0
  //               ) || 0
  //             )}
  //           </Badge>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
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
          <DialogTitle>Metas</DialogTitle>
          <DialogDescription>Selecione ao clicar na linha.</DialogDescription>
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
                  <div className="flex gap-2 sm:gap-3 w-max">
                    <Input
                      placeholder="Nome"
                      className="max-w-[24ch]"
                      value={filters?.nome || ""}
                      onChange={(e) => {
                        setFilters({ nome: e.target.value });
                      }}
                    />
                    <Select
                      value={filters?.id_grupo_economico || ""}
                      onValueChange={(id_grupo_economico) => {
                        setFilters({
                          id_grupo_economico: id_grupo_economico,
                          id_filial: "",
                        });
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
                        setFilters({ cargo: e.target.value });
                      }}
                    />
                    <Input
                      placeholder="CPF"
                      className="max-w-[200px]"
                      value={filters?.cpf || ""}
                      onChange={(e) => {
                        setFilters({ cpf: e.target.value });
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
          isLoading={isLoading}
          pageCount={pageCount}
          refetch={refetch}
          pagination={pagination}
          setPagination={setPagination}
          multiSelection={multiSelection}
          buttonSaveSelection={ButtonSaveSelection}
          handleRemoveAll={handleRemoveAll}
          handleSelectAll={handleSelectAll}
        >
          <table className="w-full border p-1">
            <thead>
              <tr className="text-sm">
                {/* <th className="py-1 px-1.5">Ação</th> */}
                <th className="py-1 px-1.5 text-nowrap">ID</th>
                <th className="py-1 px-1.5 text-nowrap">Ref</th>
                <th className="py-1 px-1.5 text-nowrap">Ciclo</th>
                <th className="py-1 px-1.5 text-nowrap">Grupo Econômico</th>
                <th className="py-1 px-1.5 text-nowrap">Filial</th>
                <th className="py-1 px-1.5 text-nowrap">Cargo</th>
                <th className="py-1 px-1.5 text-nowrap">CPF</th>
                <th className="py-1 px-1.5 text-nowrap">Nome</th>
                <th className="py-1 px-1.5 text-nowrap">Tags</th>
                <th className="py-1 px-1.5 text-nowrap">Data Inicial</th>
                <th className="py-1 px-1.5 text-nowrap">Data Final</th>
                <th className="py-1 px-1.5 text-nowrap">Proporcional</th>
              </tr>
            </thead>
            <tbody>
              {data?.rows.map((item: MetasProps, index: number) => {
                const isSelected = ids.includes(item.id || "");

                return (
                  <tr
                    key={"metas:" + item.id + index}
                    className={`bg-secondary odd:bg-secondary/70 text-secondary-foreground justify-between mb-1 border rounded-md py-1 px-1. px-2 ${
                      isSelected &&
                      "bg-primary/80 odd:bg-primary/90 border-transparent text-primary-foreground/40"
                    }`}
                    onClick={() => {
                      pushSelection(item);
                    }}
                  >
                    {/* <td className="text-center py-1 px-1.5">
                      <Button
                        size={"xs"}
                        className={`py-1 px-1. ${
                          isSelected &&
                          "bg-secondary hover:bg-secondary hover:opacity-90"
                        }`}
                        variant={"outline"}
                        
                      >
                        {isSelected ? "Desmarcar" : "Selecionar"}
                      </Button>
                    </td> */}
                    <td className="text-xs text-nowrap py-1 px-1.5">
                      {item.id}
                    </td>
                    <td className="text-xs text-nowrap py-1 px-1.5">
                      {normalizeDate(item.ref || "")}
                    </td>
                    <td className="text-xs text-nowrap py-1 px-1.5">
                      {normalizeDate(item.ciclo || "")}
                    </td>
                    <td className="text-xs text-nowrap py-1 px-1.5">
                      {item.grupo_economico}
                    </td>
                    <td className="text-xs text-nowrap py-1 px-1.5">
                      {item.filial}
                    </td>
                    <td className="text-xs text-nowrap py-1 px-1.5">
                      {item.cargo}
                    </td>
                    <td className="text-xs text-nowrap py-1 px-1.5">
                      {item.cpf}
                    </td>
                    <td className="text-xs text-nowrap py-1 px-1.5">
                      {item.nome}
                    </td>
                    <td className="text-xs text-nowrap py-1 px-1.5">
                      {item.tags}
                    </td>
                    <td className="text-xs text-nowrap py-1 px-1.5">
                      {normalizeDate(item.data_inicial || "")}
                    </td>
                    <td className="text-xs text-nowrap py-1 px-1.5">
                      {normalizeDate(item.data_final || "")}
                    </td>
                    <td className="text-xs text-nowrap py-1 px-1.5">
                      {normalizePercentual(item.proporcional || "")}
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
          closeOnSelection
          id_grupo_economico={filters?.id_grupo_economico}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ModalMetas;
