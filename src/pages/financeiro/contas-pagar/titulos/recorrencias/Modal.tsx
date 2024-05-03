import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import AlertPopUp from "@/components/custom/AlertPopUp";
import SelectMes from "@/components/custom/SelectMes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exportToExcel } from "@/helpers/importExportXLS";
import {
  normalizeCurrency,
  normalizeDate,
  normalizeFirstAndLastName,
  normalizeMes,
} from "@/helpers/mask";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import {
  Check,
  Download,
  EraserIcon,
  FilterIcon,
  Pen,
  Plus,
  Trash,
} from "lucide-react";
import { useStoreTitulo } from "../titulo/store";
import ModalEditarRecorrencias from "./editar/Modal";
import { useStoreEditarRecorrencias } from "./editar/store";
import { useStoreRecorrencias } from "./store";

type recorrenciaProps = {
  id: string;
  fornecedor: string;
  filial: string;
  data_vencimento: string;
  valor: string;
  descricao: string;
  centro_custo: string;
  grupo_economico: string;
  criador: string;
  id_titulo: string;
  lancado: boolean;
};

const ModalRecorrencias = () => {
  const modalOpen = useStoreRecorrencias().modalOpen;
  const resetFilters = useStoreRecorrencias().resetFilters;
  const setFilters = useStoreRecorrencias().setFilters;
  const filters = useStoreRecorrencias().filters;
  const openModal = useStoreTitulo.getState().openModal;
  const openModalEditarTitulo = useStoreEditarRecorrencias.getState().openModal;
  const closeModal = useStoreRecorrencias().closeModal;

  const { data, isLoading, refetch } = useTituloPagar().getRecorrencias({
    filters,
  });
  const { mutate: deleteRecorrencia } = useTituloPagar().deleteRecorrencia();
  const rows = data?.data.rows;

  const handleClickFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    refetch();
  };
  const handleResetFilter = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await new Promise((resolve) => resolve(resetFilters()));
    refetch();
  };

  async function exportRecorrencias() {
    const exportedData: any[] = [];
    for (const row of rows) {
      exportedData.push({
        "ID TITULO": row.id_titulo,
        FORNECEDOR: row.fornecedor,
        FILIAL: row.filial,
        "DATA VENCIMENTO": normalizeDate(row.data_vencimento),
        VALOR: row.valor,
        DESCRICAO: row.descricao,
        CENTRO_CUSTO: row.centro_custo,
        "GRUPO ECONOMICO": row.grupo_economico,
        CRIADOR: normalizeFirstAndLastName(row.criador),
      });
    }
    exportToExcel(
      exportedData,
      `recorrencias-${normalizeMes(filters.mes || "")}-${filters.ano}`
    );
  }

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-2 justify-between items-center mb-2">
            <span>Recorrências</span>
            <Button
              variant={"outline"}
              type={"button"}
              onClick={() => exportRecorrencias()}
            >
              <Download className="me-2" size={20} />
              Exportar
            </Button>
          </DialogTitle>
          <Accordion
            type="single"
            collapsible
            className="p-2 border-2 dark:border-slate-800 rounded-lg "
          >
            <AccordionItem value="item-1" className="relative border-0">
              <div className="flex gap-3 items-center absolute start-16 top-1">
                <Button size={"xs"} onClick={handleClickFilter}>
                  Aplicar <FilterIcon size={12} className="ms-2" />
                </Button>
                <Button
                  size={"xs"}
                  variant="secondary"
                  onClick={handleResetFilter}
                >
                  Limpar <EraserIcon size={12} className="ms-2" />
                </Button>
              </div>

              <AccordionTrigger className={`py-1 hover:no-underline`}>
                <span className="">Filtros</span>
              </AccordionTrigger>

              <AccordionContent className="flex gap-2 p-0 pt-3">
                <SelectMes
                  placeholder="Selecione o mês..."
                  value={filters.mes?.toString()}
                  onValueChange={(mes) => {
                    setFilters({ mes: mes });
                  }}
                />
                <Input
                  type="number"
                  step={"1"}
                  min={2023}
                  placeholder="Digite o ano"
                  value={filters.ano}
                  onChange={(e) => {
                    setFilters({ ano: e.target.value });
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <div className="flex flex-col gap-3 rounded-md border">
              <Table className="mb-1">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center text-sm px-2 py-1">
                      Ações
                    </TableHead>
                    <TableHead className="text-start text-sm min-w-[15ch] px-2 py-1">
                      Fornecedor
                    </TableHead>
                    <TableHead className="text-start text-sm min-w-[15ch] px-2 py-1">
                      Filial
                    </TableHead>
                    <TableHead className="text-start text-sm min-w-[15ch] px-2 py-1">
                      Data Vencimento
                    </TableHead>
                    <TableHead className="text-center text-sm min-w-[15ch] px-2 py-1">
                      Valor
                    </TableHead>
                    <TableHead className="text-start text-sm min-w-[15ch] px-2 py-1">
                      Descrição
                    </TableHead>
                    <TableHead className="text-start text-sm min-w-[15ch] px-2 py-1">
                      Centro de Custo
                    </TableHead>
                    <TableHead className="text-start text-sm min-w-[15ch] px-2 py-1">
                      Grupo Econômico
                    </TableHead>
                    <TableHead className="text-start text-sm min-w-[15ch] px-2 py-1">
                      Criador
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.rows?.map(
                    (rec: recorrenciaProps, index: number) => (
                      <TableRow key={`rec.${index}`} className="text-nowrap">
                        <TableCell className="flex gap-2 justify-center text-xs p-2">
                          {rec["lancado"] ? (
                            <Button
                              title="Solicitado"
                              size={"xs"}
                              disabled={true}
                            >
                              <Check size={18} />
                            </Button>
                          ) : (
                            <Button
                              title="Nova solicitação"
                              size={"xs"}
                              onClick={() => {
                                closeModal();
                                openModal(rec["id_titulo"], {
                                  data_vencimento: rec["data_vencimento"],
                                  id: rec["id"],
                                });
                              }}
                            >
                              <Plus size={18} />
                            </Button>
                          )}
                          <Button
                            onClick={() => openModalEditarTitulo(rec["id"])}
                            title="Editar recorrência"
                            size={"xs"}
                            variant={"warning"}
                          >
                            <Pen size={18} />
                            {/* {} */}
                          </Button>
                          <AlertPopUp
                            title="Deseja realmente excluir?"
                            description="Essa ação não pode ser desfeita. A recorrência será excluída definitivamente do servidor."
                            action={() => deleteRecorrencia(rec["id"])}
                          >
                            <Button
                              onClick={() => console.log("Exluir")}
                              title="Excluir recorrência"
                              size={"xs"}
                              variant={"destructive"}
                            >
                              <Trash size={18} />
                              {/* {} */}
                            </Button>
                          </AlertPopUp>
                        </TableCell>
                        <TableCell className="text-xs p-2">
                          {rec["fornecedor"]}
                        </TableCell>
                        <TableCell className="text-xs p-2">
                          {rec["filial"]}
                        </TableCell>
                        <TableCell className="text-xs p-2 text-center">
                          {normalizeDate(rec["data_vencimento"])}
                        </TableCell>
                        <TableCell className="text-xs p-2 text-center">
                          {normalizeCurrency(rec["valor"])}
                        </TableCell>
                        <TableCell className="text-xs p-2">
                          {rec["descricao"]}
                        </TableCell>
                        <TableCell className="text-xs p-2">
                          {rec["centro_custo"]}
                        </TableCell>
                        <TableCell className="text-xs p-2">
                          {rec["grupo_economico"]}
                        </TableCell>
                        <TableCell className="text-xs p-2">
                          {normalizeFirstAndLastName(rec["criador"])}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
      <ModalEditarRecorrencias />
    </Dialog>
  );
};

export default ModalRecorrencias;
