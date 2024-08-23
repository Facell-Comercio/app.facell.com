import { Button } from "@/components/ui/button";
import { ConferenciasCaixaSchema } from "@/hooks/financeiro/useConferenciasCaixa";
import { TbAlertTriangle } from "react-icons/tb";
import { badgeVariantCaixaClass } from "../../table/columns";
import { useStoreCaixa } from "../store";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const StatusCaixa = ({ data }: { data: ConferenciasCaixaSchema }) => {
  const queryClient = useQueryClient();

  const [openModalOcorrencias, isPending] = useStoreCaixa((state) => [
    state.openModalOcorrencias,
    state.isPending,
  ]);
  const caixaConfirmado = !!+data.caixa_confirmado;
  
  const isDivergent = parseInt(data.divergente || "0");
  const ocorrencias = parseInt(data.ocorrencias || "0");
  const ocorrenciasResolvidas = parseInt(data.ocorrencias_resolvidas || "0");
  const todasResolvidas = ocorrencias === ocorrenciasResolvidas;
  const ocorrenciasParaResolver = ocorrencias - ocorrenciasResolvidas;
  const baixa_manual = !!+data.manual;
  
  const handleChangeBaixaManual = async (checked:boolean)=>{
    try {
      await api.put(`/financeiro/controle-de-caixa/conferencia-de-caixa/change-value`, {id: data.id, campo: 'manual', valor: checked})
      queryClient.setQueryData(["financeiro", "conferencia_de_caixa", "caixas", "detalhe", parseInt(`${data?.id}`)], {...data, manual: checked ? 1 : 0})
    } catch (error) {
      toast({
        variant: 'destructive', title: 'Erro ao tentar alterar o tipo de baixa do caixa',
        // @ts-ignore
        description: error?.response?.data?.message || error.message
      })
    }
  }
  
  return (
    <div className="flex items-center gap-3 flex-wrap text-center">
      <span>
        <p className="text-sm font-medium p-2">Divergente</p>
        <Button
          variant={isDivergent ? "destructive" : "success"}
          className="w-full"
        >
          {isDivergent ? "SIM" : "NÃO"}
        </Button>
      </span>
      <span>
        <p className="text-sm font-medium p-2">Status</p>
        <Button className={`w-full ${badgeVariantCaixaClass(data.status)}`}>
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
      <div className="flex gap-2 ms-auto mt-4 me-2" title="Aqui você informa se vai realizar a confirmação manualmente ou se o robô quem irá realizar. O padrão é o robô realizar.">
        <label>Baixar Manualmente</label>
        <Switch 
          checked={baixa_manual} 
          disabled={caixaConfirmado}
          onCheckedChange={handleChangeBaixaManual} 
          />
      </div>
    </div>
  );
};

export default StatusCaixa;
