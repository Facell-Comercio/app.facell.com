import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BlocoNotasPendentes = () => {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-md flex items-center justify-between">
          <span>Notas Fiscais Pendentes</span>{" "}
          <Badge variant={"destructive"} className="text-base">
            3
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto scroll-thin pb-3">
          {/* Tabela fake, considerar apenas headers */}
          <table className="text-sm">
            <thead>
              <tr className="text-nowrap">
                <th>ID TÍTULO</th>
                <th>DATA SOLICITAÇÃO</th>
                <th>VALOR</th>
                <th>FORNECEDOR</th>
                <th>FILIAL</th>
                <th>DESCRICAO</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-nowrap">
                <td className="p-2 text-primary font-semibold cursor-pointer">
                  10652
                </td>
                <td className="p-2">24/05/2024 11:00</td>
                <td className="p-2">R$ 10.000,99</td>

                <td className="p-2">FACELL COMERCIO DE...</td>
                <td className="p-2">01 TIM MIDWAY</td>
                <td className="p-2">COMPRA DE MERCADORIA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
