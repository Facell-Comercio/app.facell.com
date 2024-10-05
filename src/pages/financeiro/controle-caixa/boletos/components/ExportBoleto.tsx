import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SelectGrupoEconomico } from "@/components/custom/SelectGrupoEconomico";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { api } from "@/lib/axios";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";

type ModalExportBoletoProps = {
  modalOpen: boolean;
  handleClickCancel: () => void;
};

const initialPropsFormData = {
  id_grupo_economico: "",
  id_conta_bancaria: "",
  conta_bancaria: "",
};

const ModalExportBoleto = ({ modalOpen, handleClickCancel }: ModalExportBoletoProps) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState(initialPropsFormData);
  const [modalContaBancariaOpen, setModalContaBancariaOpen] = useState(false);
  //^ Reseta a formData ao fechar
  useEffect(() => {
    !modalOpen && setFormData(initialPropsFormData);
  }, [modalOpen]);

  const [isLoadingRemessaSelecao, setIsLoadingRemessaSelecao] = useState<boolean>(false);
  async function handleRemessaDownload() {
    try {
      setIsLoadingRemessaSelecao(true);
      const response = await api.post(
        "financeiro/controle-de-caixa/boletos/export-remessa",
        {
          id_grupo_economico: formData.id_grupo_economico,
          id_conta_bancaria: formData.id_conta_bancaria,
        },
        { responseType: "blob" }
      );
      downloadResponse(response);
      queryClient.invalidateQueries({
        queryKey: ["financeiro", "conferencia_de_caixa", "boletos"],
      });
      handleClickCancel();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ops!",
        // @ts-ignore
        description: error?.response?.data?.message || error.message,
      });
    } finally {
      setIsLoadingRemessaSelecao(false);
    }
  }

  function handleSelectionContaBancaria(conta_bancaria: ItemContaBancariaProps) {
    setFormData((prev) => ({
      ...prev,
      id_conta_bancaria: conta_bancaria.id || "",
      conta_bancaria: conta_bancaria.descricao || "",
    }));
    setModalContaBancariaOpen(false);
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle className="flex gap-4">Exportar Remessa de Boletos</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <span className="flex gap-2 flex-col">
            <label className="font-medium text-sm">Grupo Econômico:</label>
            <SelectGrupoEconomico
              value={formData.id_grupo_economico}
              onChange={(id) =>
                setFormData({
                  id_grupo_economico: id || "",
                  id_conta_bancaria: "",
                  conta_bancaria: "",
                })
              }
              className="flex-1 min-w-64"
            />
          </span>

          <span className="flex gap-2 flex-col">
            <label className="font-medium text-sm">Conta Bancária:</label>
            <Input
              title={!formData.id_grupo_economico ? "Primeiro selecione o grupo econômico!" : ""}
              value={formData.conta_bancaria}
              disabled={!formData.id_grupo_economico}
              onClick={() => formData.id_grupo_economico && setModalContaBancariaOpen(true)}
              placeholder="Conta Bancária"
            />
          </span>
        </div>
        <ModalContasBancarias
          open={modalContaBancariaOpen}
          handleSelection={handleSelectionContaBancaria}
          onOpenChange={() => setModalContaBancariaOpen((prev) => !prev)}
          id_grupo_economico={formData.id_grupo_economico || ""}
        />
        <DialogFooter className="flex w-full">
          <Button disabled={isLoadingRemessaSelecao} onClick={() => handleRemessaDownload()}>
            {isLoadingRemessaSelecao ? (
              <>
                <FaSpinner size={18} className="me-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="me-2" size={18} />
                Exportar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ExportBoleto = () => {
  const [modalExportBoletoIsOpen, setModalExportBoletoIsOpen] = useState(false);
  return (
    <>
      <Button
        variant={"outline"}
        className="border-success"
        onClick={() => setModalExportBoletoIsOpen(true)}
      >
        <Download className="me-2" size={18} /> Exportar Remessa
      </Button>
      <ModalExportBoleto
        modalOpen={modalExportBoletoIsOpen}
        handleClickCancel={() => setModalExportBoletoIsOpen(false)}
      />
    </>
  );
};

export default ExportBoleto;
