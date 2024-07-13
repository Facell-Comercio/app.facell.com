import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InputDate } from "@/components/custom/InputDate";
import SelectGrupoEconomico from "@/components/custom/SelectGrupoEconomico";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/helpers/importExportXLS";
import { api } from "@/lib/axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreExportDatasys } from "./store";

type ExportDatasysProps = {
  id_grupo_economico?: string;
  data_pagamento?: Date;
};

const ModalExportDatasys = () => {
  const [filters, setFilters] = useState<ExportDatasysProps>({
    id_grupo_economico: "",
    data_pagamento: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const modalOpen = useStoreExportDatasys().modalOpen;
  const closeModal = useStoreExportDatasys().closeModal;

  async function exportDatasys() {
    if (!filters.id_grupo_economico || !filters.data_pagamento) {
      toast({
        title: "Dados insuficientes!",
        description:
          "Preencha os campos de grupo econômico e de data de pagamento",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.get(
        `/financeiro/contas-a-pagar/titulo/export-datasys`,
        {
          params: { filters },
        }
      );
      const rows = response?.data || [];

      // const formatedResponse = rows.map((row: ResponseExportDatasysProps) => {
      //   return {
      //     "CNPJ LOJA": row.cnpj_loja,
      //     "CPF / CNPJ FORNECEDOR": row.cnpj_fornecedor,
      //     DOCUMENTO: row.id_titulo,
      //     EMISSÃO: normalizeDate(row.emissao),
      //     VENCIMENTO: normalizeDate(row.vencimento),
      //     VALOR: row.valor,
      //     "TIPO DOCUMENTO": row.tipo_documento.toUpperCase(),
      //     HISTÓRICO: row.historico.toUpperCase(),
      //     BARCODE: row.bar_code,
      //     "CENTRO DE CUSTOS": row.centro_custo.toUpperCase(),
      //     "PLANO DE CONTAS": row.plano_contas,
      //     "CNPJ RATEIO": row.cnpj_rateio,
      //     "VALOR RATEIO": (
      //       parseFloat(row.valor_rateio) * parseFloat(row.percentual)
      //     ).toFixed(2),
      //     "BANCO PG": row.data_pg && row.data_pg.toUpperCase(),
      //     "DATA PG": row.data_pg && normalizeDate(row.data_pg),
      //     "NOME FORNECEDOR": row.nome_fornecedor.toUpperCase(),
      //     PERCENTUAL: parseFloat(row.percentual),
      //   };
      // });
      exportToExcel(
        rows,
        `EXPORTAÇÃO DATASYS GRUPO ${filters.id_grupo_economico} ${format(
          filters.data_pagamento,
          "dd.MM.yyyy"
        )}`
      );
      closeModal();
    } catch (err) {
      toast({
        title: "Erro!",
        description: "Houve um problema no processo de exportação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (!modalOpen) {
      setFilters({
        id_grupo_economico: "",
        data_pagamento: undefined,
      });
      setIsLoading(false);
    }
  }, [modalOpen]);

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="mb-2">Exportar para o Datasys</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && (
            <div className="flex gap-3 p-1">
              <span className="w-2/3">
                <label className="text-sm font-medium">Grupo Econômico</label>
                <SelectGrupoEconomico
                  value={filters.id_grupo_economico}
                  onChange={(id_grupo_economico) => {
                    setFilters({
                      ...filters,
                      id_grupo_economico: id_grupo_economico,
                    });
                  }}
                  className="w-full mt-2"
                />
              </span>
              <span className="">
                <label className="text-sm font-medium">Data de Pagamento</label>
                <InputDate
                  className="mt-2 w-full"
                  value={filters.data_pagamento}
                  onChange={(e: Date) =>
                    setFilters({ ...filters, data_pagamento: e })
                  }
                />
              </span>
            </div>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <DialogFooter>
          <Button disabled={isLoading} onClick={() => exportDatasys()}>
            {isLoading ? (
              <span className="flex gap-2 w-full items-center justify-center">
                <FaSpinner size={18} className="me-2 animate-spin" />{" "}
                Carregando...
              </span>
            ) : (
              "Exportar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalExportDatasys;
