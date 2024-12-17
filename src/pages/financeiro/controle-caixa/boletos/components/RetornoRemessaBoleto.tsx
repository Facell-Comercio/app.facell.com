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
import { exportToExcel } from "@/helpers/importExportXLS";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Upload } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa6";

type ModalRetornoRemessaProps = {
  modalOpen: boolean;
  handleClickCancel: () => void;
};

const initialPropsFormData = {
  id_grupo_economico: "",
  id_conta_bancaria: "",
  conta_bancaria: "",
  codigo_banco: "",
};

const ModalRetornoRemessa = ({ modalOpen, handleClickCancel }: ModalRetornoRemessaProps) => {
  const {
    data: result,
    mutate: importRetorno,
    isSuccess: importRetornoIsSuccess,
    isPending: importRetornoIsPending,
    // isError: importRetornoIsError,
  } = useConferenciasCaixa().importRemessaBoleto();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState(initialPropsFormData);
  const [modalContaBancariaOpen, setModalContaBancariaOpen] = useState(false);
  const handleFileImportClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };
  const handleFileImportChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    if (!target.files) {
      return;
    }
    importRetorno({ files: target.files, codigo_banco: formData.codigo_banco });
  };

  useEffect(() => {
    if (importRetornoIsSuccess && result) {
      if (fileRef?.current) {
        fileRef.current.value = "";
      }
      exportToExcel(result, "RESULTADO IMPORTAÇÃO DE REMESSA");
      handleClickCancel();
    }
  }, [result]);

  useEffect(() => {
    !modalOpen && setFormData(initialPropsFormData);
  }, [modalOpen]);

  function handleSelectionContaBancaria(conta_bancaria: ItemContaBancariaProps) {
    setFormData((prev) => ({
      ...prev,
      id_conta_bancaria: conta_bancaria.id || "",
      conta_bancaria: conta_bancaria.descricao || "",
      codigo_banco: conta_bancaria.codigo_banco || "",
    }));
    setModalContaBancariaOpen(false);
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle className="flex gap-4">Importar Retorno de Remessa de Boletos</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
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
                  codigo_banco: "",
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
          <div title={!formData.codigo_banco ? "Primeiro defina a conta bancária!" : ""}>
            <input
              onChange={handleFileImportChange}
              ref={fileRef}
              type="file"
              multiple
              accept=".ret"
              className="hidden"
            />
            <Button
              onClick={() => handleFileImportClick()}
              disabled={importRetornoIsPending || !formData.codigo_banco}
            >
              {importRetornoIsPending ? (
                <FaSpinner size={18} className="animate-spin me-2" />
              ) : (
                <Upload size={18} className="me-2" />
              )}
              Importar Retorno
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RetornoRemessa = () => {
  const [modalRetornoRemessaIsOpen, setModalRetornoRemessaIsOpen] = useState(false);
  return (
    <>
      <Button
        variant={"outline"}
        className="border-violet-400 dark:border-violet-800"
        onClick={() => setModalRetornoRemessaIsOpen(true)}
      >
        <Upload className="me-2" size={18} /> Importar Retorno
      </Button>
      <ModalRetornoRemessa
        modalOpen={modalRetornoRemessaIsOpen}
        handleClickCancel={() => setModalRetornoRemessaIsOpen(false)}
      />
    </>
  );
};

export default RetornoRemessa;
