// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";

type ComparisonTableDataProps = {
  filial: string;
  controle: boolean;
  pos: boolean;
  upgrade: boolean;
  qtde_aparelho: boolean;
  receita: boolean;
  aparelho: boolean;
  acessorio: boolean;
  pitzi: boolean;
  fixo: boolean;
  wttx: boolean;
  live: false;
};

const ComparisonTable = ({ data }: { data: ComparisonTableDataProps[] }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="text-nowrap cursor-pointer text-xs">
          <TableRow>
            <TableHead>Filial</TableHead>
            <TableHead>Controle</TableHead>
            <TableHead>POS</TableHead>
            <TableHead>Upgrade</TableHead>
            <TableHead>Qtde Aparelhos</TableHead>
            <TableHead>Receita</TableHead>
            <TableHead>Aparelho</TableHead>
            <TableHead>Acessório</TableHead>
            <TableHead>Pitzi</TableHead>
            <TableHead>Fixo</TableHead>
            <TableHead>WTTX</TableHead>
            <TableHead>Live</TableHead>
          </TableRow>
        </TableHeader>
        {data.length > 0 && (
          <TableBody>
            {data.map((filialData, index) => (
              <TableRow key={`filial.${index}.${filialData.filial}`}>
                <TableCell className="text-nowrap text-xs uppercase">{filialData.filial}</TableCell>
                <TableCell>
                  <span className="flex items-center justify-center">
                    {filialData.controle ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center">
                    {filialData.pos ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center">
                    {filialData.upgrade ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center">
                    {filialData.qtde_aparelho ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center">
                    {filialData.receita ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center">
                    {filialData.aparelho ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center">
                    {filialData.acessorio ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center">
                    {filialData.pitzi ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center">
                    {filialData.fixo ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center">
                    {filialData.wttx ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center justify-center">
                    {filialData.live ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-red-500" />
                    )}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default ComparisonTable;
