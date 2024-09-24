import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/helpers/importExportXLS";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { Upload } from "lucide-react";
import { ChangeEvent, useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa6";

const RetornoRemessa = () => {
  const {
    data: result,
    mutate: importRetorno,
    isSuccess: importRetornoIsSuccess,
    isPending: importRetornoIsPending,
    // isError: importRetornoIsError,
  } = useConferenciasCaixa().importRemessaBoleto();
  const fileRef = useRef<HTMLInputElement | null>(null);
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
    importRetorno(target.files);
  };

  useEffect(() => {
    if (importRetornoIsSuccess && result) {
      if(fileRef?.current){
        fileRef.current.value = ''
      }
      exportToExcel(result, "RESULTADO IMPORTAÇÃO DE REMESSA");
    }
  }, [result]);
  return (
    <>
      <input
        onChange={handleFileImportChange}
        ref={fileRef}
        type="file"
        multiple
        accept=".ret"
        className="hidden"
      />
      <Button
        variant={"outline"}
        className="border-violet-400 dark:border-violet-800"
        onClick={() => handleFileImportClick()}
        disabled={importRetornoIsPending}
      >
        {importRetornoIsPending ? (
          <FaSpinner size={18} className="animate-spin me-2" />
        ) : (
          <Upload size={18} className="me-2" />
        )}
        Importar Retorno
      </Button>
    </>
  );
};

export default RetornoRemessa;
