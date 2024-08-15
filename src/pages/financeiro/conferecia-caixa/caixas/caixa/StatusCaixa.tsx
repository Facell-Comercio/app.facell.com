import { Button } from "@/components/ui/button";
import { ConferenciasCaixaSchema } from "@/hooks/financeiro/useConferenciasCaixa";
import { TriangleAlert } from "lucide-react";
import { badgeVariantCaixa } from "../table/columns";

const StatusCaixa = ({ data }: { data: ConferenciasCaixaSchema }) => {
  const isDivergent = parseInt(data.divergente || "0");
  const ocorrencias = parseInt(data.ocorrencias || "0");
  const ocorrenciasResolvidas = parseInt(data.ocorrencias_resolvidas || "0");
  const todasResolvidas = ocorrencias === ocorrenciasResolvidas;

  return (
    <div className="flex gap-3 flex-wrap text-center">
      <span>
        <p className="text-sm font-medium p-2">Divergente</p>
        <Button
          variant={isDivergent ? "destructive" : "outline"}
          className="w-full"
        >
          {isDivergent ? "SIM" : "NÃO"}
        </Button>
      </span>
      <span>
        <p className="text-sm font-medium p-2">Status</p>
        <Button variant={badgeVariantCaixa(data.status)} className="w-full">
          {data.status}
        </Button>
      </span>
      <span>
        <p className="text-sm font-medium p-2">Ocorrências</p>
        <Button
          variant={!ocorrencias || todasResolvidas ? "success" : "destructive"}
          className="flex gap-1.5 w-full"
        >
          <TriangleAlert />
          Ocorrências: ({ocorrencias})
        </Button>
      </span>
    </div>
  );
};

export default StatusCaixa;
