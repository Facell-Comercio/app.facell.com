import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useRef, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { FaSpinner } from "react-icons/fa6";
import { useExtratosStore } from "../../context";

const ButtonImport = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tipoExtato, setTipoExtato] = useState<"cnab" | "ofx" | null>(null);

  const contaBancaria = useExtratosStore().contaBancaria;
  let fileRef = useRef<null | HTMLInputElement>(null);

  const handleClickImport = (tipo_extrato: "cnab" | "ofx") => {
    setTipoExtato(tipo_extrato);
    fileRef?.current?.click();
  };

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const form = new FormData();
      const file = fileRef?.current?.files && fileRef?.current?.files[0];
      if (!file) {
        return;
      }
      const id_conta_bancaria = contaBancaria?.id;
      if (!id_conta_bancaria) {
        throw new Error("Selecione a conta bancária!");
      }

      form.append("file", file);
      form.append("id_conta_bancaria", String(id_conta_bancaria));
      form.append("tipo_extrato", String(tipoExtato));

      await api.postForm("financeiro/conciliacao-bancaria/importar-extrato", form);
      toast({
        variant: "success",
        title: "Importação realizada!",
      });
      queryClient.invalidateQueries({
        queryKey: ["financeiro", "extrato_bancario"],
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na importação do extrato!",
        description:
          // @ts-ignore
          error?.response?.data?.message ||
          "Ocorreu um erro na requisição, tente novamente ao recarregar a página!",
      });
    } finally {
      setIsLoading(false);
      if (fileRef?.current) {
        setTipoExtato(null);
        fileRef.current.value = "";
      }
    }
  };

  const disabled = !contaBancaria || isLoading;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          type="button"
          className="py-2 px-4 bg-primary text-sm flex disabled:opacity-50 font-medium gap-2 items-center rounded-md"
        >
          <Upload className="me-2" size={18} /> Importar Extrato
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => handleClickImport("ofx")}
            disabled={disabled}
          >
            {!isLoading ? (
              <>Importar OFX</>
            ) : (
              <>
                <FaSpinner size={18} className="me-2 animate-spin" /> Importando...
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => handleClickImport("cnab")}
            disabled={disabled}
          >
            {!isLoading ? (
              <>Importar CNAB 240</>
            ) : (
              <>
                <FaSpinner size={18} className="me-2 animate-spin" /> Importando...
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
        <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} />
      </DropdownMenu>
      {/* <Button disabled={!contaBancaria || isLoading} onClick={handleClickImport}>
        {isLoading ? (
          <div className="flex gap-2">
            <FaSpinner size={18} className="animate-spin" /> Importando...
          </div>
        ) : (
          <div className="flex gap-1">
            <Upload size={18} className="me-2" />
            Importar Extrato
          </div>
        )}
      </Button> */}
    </>
  );
};

export default ButtonImport;
