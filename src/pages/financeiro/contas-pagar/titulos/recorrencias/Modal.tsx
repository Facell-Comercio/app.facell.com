import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import SelectMes from "@/components/custom/SelectMes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ScrollArea,
  ScrollBar,
} from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import {
  Check,
  Download,
  Pen,
  Plus,
  Trash,
} from "lucide-react";
import { useStoreTituloPagar } from "../titulo/store";
import ModalEditarRecorrencias from "./ModalEditarRecorrencia";
import { useStoreRecorrencias } from "./store";
import { useMemo } from "react";
import { formatDate } from "date-fns";
import { Switch } from "@/components/ui/switch";

type recorrenciaProps = {
  id: string;
  fornecedor: string;
  filial: string;
  data_vencimento: string;
  valor: string;
  descricao: string;
  grupo_economico: string;
  criador: string;
  id_titulo: string;
  lancado: boolean;
};

const ModalRecorrencias = () => {
  const [
    modalOpen,
    filters,
    closeModal,
    setFilters,
    openModalEditRecorrencia,
  ] = useStoreRecorrencias((state) => [
    state.modalOpen,
    state.filters,
    state.closeModal,
    state.setFilters,
    state.openModalEditRecorrencia,
  ]);

  const openModal =
    useStoreTituloPagar.getState().openModal;

  const { data, isLoading, refetch } =
    useTituloPagar().getRecorrencias({
      filters,
    });

  const { mutate: deleteRecorrencia } =
    useTituloPagar().deleteRecorrencia();

  const { termo } = filters;

  const rows: recorrenciaProps[] = data?.data.rows;
  const recorrencias: recorrenciaProps[] = useMemo(() => {
    let array
    if (termo) {
      let termoLower = termo?.toLowerCase();
      array = rows.filter(rec=>{
        let fornecedor = rec.fornecedor?.toLowerCase();
        let descricao = rec.descricao?.toLowerCase();
        let filial = rec.filial?.toLowerCase();
        let grupo_economico = rec.grupo_economico?.toLowerCase();
        let data_vencimento = formatDate(rec.data_vencimento,'dd/MM/yyyy');
        
        if(fornecedor.includes(termoLower) || descricao.includes(termoLower) || filial.includes(termoLower) || grupo_economico.includes(termoLower)|| data_vencimento.includes(termoLower)){
          return true
        }else{
          return false;
        }
      })
    }else{
      array = rows;
    } 
    return array;
  }, [data, filters])

  async function exportRecorrencias() {
    const exportedData: any[] = [];
    for (const row of rows) {
      exportedData.push({
        "ID TITULO": row.id_titulo,
        FORNECEDOR: row.fornecedor,
        FILIAL: row.filial,
        "DATA VENCIMENTO": normalizeDate(
          row.data_vencimento
        ),
        VALOR: row.valor,
        DESCRICAO: row.descricao,
        "GRUPO ECONOMICO": row.grupo_economico,
        CRIADOR: normalizeFirstAndLastName(
          row.criador
        ),
      });
    }
    exportToExcel(
      exportedData,
      `recorrencias-${normalizeMes(
        filters.mes || ""
      )}-${filters.ano}`
    );
  }

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={closeModal}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-2 justify-between items-center mb-2">
            <span>Recorrências</span>
            <Button
              variant={"outline"}
              type={"button"}
              onClick={() => exportRecorrencias()}
            >
              <Download
                className="me-2"
                size={20}
              />
              Exportar
            </Button>
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <SelectMes
            className="max-w-32"
              placeholder="Selecione o mês..."
              value={filters.mes?.toString()}
              onValueChange={async (mes) => {
                await new Promise((resolve) =>
                  resolve(
                    setFilters({ mes: mes })
                  )
                );
                refetch();
              }}
            />
            <Input
              type="number"
              className="max-w-32"
              step={"1"}
              min={2023}
              placeholder="Digite o ano"
              value={filters.ano}
              onChange={async (e) => {
                await new Promise((resolve) =>
                  resolve(
                    setFilters({
                      ano: e.target.value,
                    })
                  )
                );
                refetch();
              }}
            />
            <Select
              value={filters.a_lancar}
              onValueChange={(e) =>
                setFilters({
                  a_lancar: e,
                })
              }
            >
              {/* Estilização sendo usada no cadastro de orçamentos */}
              <SelectTrigger
                className={`max-w-32`}
              >
                <SelectValue placeholder="Selecione a matriz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="text-left"
                  value={"0"}
                >
                  TODAS
                </SelectItem>
                <SelectItem
                  className="text-left"
                  value={"1"}
                >
                  A LANÇAR
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="search"
              value={filters.termo}
              onChange={(e) => setFilters({ termo: e.target.value })}
              placeholder="Pesquisar..."
              title="PROCURAR FORNECEDOR, GRUPO, FILIAL, VENCIMENTO, DESCRIÇÃO..."
              className="max-w-72"
            />

            <span className="min-w-40 flex items-center text-nowrap gap-2">
              <label>Apenas as minhas</label>
              <Switch checked={filters.ownerOnly} onCheckedChange={(val)=>{setFilters({ownerOnly: val})}}/>
            </span>
          </div>
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
                      Grupo Econômico
                    </TableHead>
                    <TableHead className="text-start text-sm min-w-[15ch] px-2 py-1">
                      Criador
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recorrencias.map(
                    (
                      rec: recorrenciaProps,
                      index: number
                    ) => (
                      <TableRow
                        key={`rec.${index}`}
                        className="text-nowrap"
                      >
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
                                openModal({
                                  id: rec[
                                    "id_titulo"
                                  ],
                                  recorrencia: {
                                    data_vencimento:
                                      rec[
                                      "data_vencimento"
                                      ],
                                    id: rec["id"],
                                    valor:
                                      rec[
                                      "valor"
                                      ],
                                  },
                                });
                              }}
                            >
                              <Plus size={18} />
                            </Button>
                          )}
                          <Button
                            onClick={() =>
                              openModalEditRecorrencia(
                                rec["id"],
                                new Date(
                                  rec[
                                  "data_vencimento"
                                  ]
                                ),
                                parseFloat(
                                  rec["valor"]
                                )
                              )
                            }
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
                            action={() =>
                              deleteRecorrencia(
                                rec["id"]
                              )
                            }
                          >
                            <Button
                              title="Excluir recorrência"
                              size={"xs"}
                              variant={
                                "destructive"
                              }
                            >
                              <Trash size={18} />
                              {/* {} */}
                            </Button>
                          </AlertPopUp>
                        </TableCell>
                        <TableCell className="text-xs uppercase p-2">
                          {rec["fornecedor"]}
                        </TableCell>
                        <TableCell className="text-xs uppercase p-2">
                          {rec["filial"]}
                        </TableCell>
                        <TableCell className="text-xs uppercase p-2 text-center">
                          {normalizeDate(
                            rec["data_vencimento"]
                          )}
                        </TableCell>
                        <TableCell className="text-xs uppercase p-2 text-center">
                          {normalizeCurrency(
                            rec["valor"]
                          )}
                        </TableCell>
                        <TableCell className="text-xs uppercase p-2">
                          {rec["descricao"]}
                        </TableCell>
                        <TableCell className="text-xs uppercase p-2">
                          {rec["grupo_economico"]}
                        </TableCell>
                        <TableCell className="text-xs uppercase p-2">
                          {normalizeFirstAndLastName(
                            rec["criador"]
                          )}
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
