import { Button } from "@/components/ui/button";
import { ConferenciasCaixaSchema } from "@/hooks/financeiro/useConferenciasCaixa";
import { TbAlertTriangle } from "react-icons/tb";
import { badgeVariantCaixa } from "../../table/columns";
import { useStoreCaixa } from "../store";

const StatusCaixa = ({ data }: { data: ConferenciasCaixaSchema }) => {
  const [openModalOcorrencias, isPending] = useStoreCaixa((state) => [
    state.openModalOcorrencias,
    state.isPending,
  ]);
  const isDivergent = parseInt(data.divergente || "0");
  const ocorrencias = parseInt(data.ocorrencias || "0");
  const ocorrenciasResolvidas = parseInt(data.ocorrencias_resolvidas || "0");
  const todasResolvidas = ocorrencias === ocorrenciasResolvidas;
  const ocorrenciasParaResolver = ocorrencias - ocorrenciasResolvidas;
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
          onClick={() => openModalOcorrencias()}
          disabled={isPending}
          title={
            ocorrenciasParaResolver > 0
              ? `Há ${ocorrenciasParaResolver} ${
                  ocorrenciasParaResolver > 1 ? "ocorrências" : "ocorrência"
                } para resolver`
              : ""
          }
        >
          <TbAlertTriangle size={22} />
          Ocorrências: ({ocorrencias})
        </Button>
      </span>
    </div>
  );
};

export default StatusCaixa;
