import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useStoreTableReceber } from "../table/store-table";
// import { TituloSchemaProps } from "../titulo/form-data";
import { Spinner } from "@/components/custom/Spinner";

export type ExportAnexosProps = {
  type: string;
  idSelection: number[];
};

// interface TituloProps extends TituloSchemaProps {
//   solicitante?: string;
//   forma_pagamento?: string;
//   fornecedor?: string;
//   cnpj_fornecedor?: string;
// }

const ButtonExportTitulos = () => {

  const { mutate: exportLayoutDRE, isPending: isPendingLayoutDRE } =
    useTituloPagar().exportLayoutDRE();

  const [isPending, setIsPending] = useState(false);
  useEffect(() => {
    if (isPendingLayoutDRE) {
      setIsPending(true)
    } else {
      setIsPending(false)
    }
  }, [
    isPendingLayoutDRE
  ])

  const [filters] = useStoreTableReceber((state) => [state.filters]);

  function handleExportLayoutDRE() {
    exportLayoutDRE({ filters })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        className="py-2 px-4 border border-emerald-200 dark:border-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm flex font-medium gap-2 items-center rounded-md"
        disabled={isPending}
      >
        {isPending ? <><Spinner /> Exportando...</>
          : <><Download className="me-2" size={18} /> Exportar</>}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => { }}>
          Layout Padrão
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleExportLayoutDRE}>
          Layout DRE
        </DropdownMenuItem>

        <DropdownMenuItem>
          <a
            target="_blank"
            href="#"
          >
            Planilha Padrão Importação
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ButtonExportTitulos;
