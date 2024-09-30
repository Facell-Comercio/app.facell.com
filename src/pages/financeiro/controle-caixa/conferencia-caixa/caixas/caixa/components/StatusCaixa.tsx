import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { ConferenciasCaixaSchema } from "@/hooks/financeiro/useConferenciasCaixa";
import { api } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { Check, CheckCheck, CircleDashed, Settings2 } from "lucide-react";
import { TbAlertTriangle } from "react-icons/tb";
import { badgeVariantCaixaClass } from "../../table/columns";
import { useStoreCaixa } from "../store";

const StatusCaixa = ({ data }: { data: ConferenciasCaixaSchema }) => {
  const queryClient = useQueryClient();

  const [openModalOcorrencias, openModalAjustes, isPending] = useStoreCaixa((state) => [
    state.openModalOcorrencias,
    state.openModalAjustes,
    state.isPending,
  ]);
  const caixaConfirmado = !!+data.caixa_confirmado;

  const isDivergent = parseInt(data.divergente || "0");
  const ocorrencias = parseInt(data.ocorrencias || "0");
  const ajustes = parseInt(data.ajustes || "0");
  const ocorrenciasResolvidas = parseInt(data.ocorrencias_resolvidas || "0");
  const todasResolvidas = ocorrencias === ocorrenciasResolvidas;
  const ocorrenciasParaResolver = ocorrencias - ocorrenciasResolvidas;
  const baixa_manual = !!+data.manual;

  const handleChangeBaixaManual = async (checked: boolean) => {
    try {
      await api.put(`/financeiro/controle-de-caixa/conferencia-de-caixa/change-value`, {
        id: data.id,
        campo: "manual",
        valor: checked,
      });
      queryClient.setQueryData(
        ["financeiro", "conferencia_de_caixa", "caixas", "detalhe", parseInt(`${data?.id}`)],
        { ...data, manual: checked ? 1 : 0 }
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao tentar alterar o tipo de baixa do caixa",
        description:
          // @ts-ignore
          error?.response?.data?.message ||
          // @ts-ignore
          error.message,
      });
    }
  };

  const ComponentStatusCaixa = ({ status }: { status: string }) => {
    if (status === "A CONFERIR") {
      return (
        <Button className={`w-full ${badgeVariantCaixaClass(status)}`}>
          <CircleDashed size={22} className="me-2" />
          {status}
        </Button>
      );
    }
    if (status === "CONFERIDO") {
      return (
        <Button className={`w-full ${badgeVariantCaixaClass(status)}`}>
          <Check size={22} className="me-2" />
          {status}
        </Button>
      );
    }
    if (status === "CONFIRMADO") {
      return (
        <Button className={`w-full ${badgeVariantCaixaClass(status)}`}>
          <CheckCheck size={22} className="me-2" />
          {status}
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center gap-3 flex-wrap text-center">
      <span>
        <p className="text-sm font-medium p-2">Divergente</p>
        <Button variant={isDivergent ? "destructive" : "success"} className="w-full">
          {isDivergent ? "SIM" : "NÃO"}
        </Button>
      </span>
      <span>
        <p className="text-sm font-medium p-2">Status</p>
        <ComponentStatusCaixa status={data.status || ""} />
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
      <span>
        <p className="text-sm font-medium p-2">Ajustes</p>
        <Button
          variant={"destructive"}
          className="flex gap-1.5 w-full"
          onClick={() => openModalAjustes({ id: data.id || "" })}
          disabled={isPending}
          title={ajustes > 0 ? `Há ${ajustes} ${ajustes > 1 ? "ajustes" : "ajuste"}` : ""}
        >
          <Settings2 size={22} />
          Ajustes: ({ajustes})
        </Button>
      </span>
      <div
        className="gap-2 ms-auto mt-4 me-2 hidden"
        title="Aqui você informa se vai realizar a confirmação manualmente ou se o robô quem irá realizar. O padrão é o robô realizar."
      >
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
