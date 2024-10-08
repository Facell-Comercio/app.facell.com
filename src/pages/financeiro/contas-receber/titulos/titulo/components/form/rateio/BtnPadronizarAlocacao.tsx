import FormInput from "@/components/custom/FormInput";
import { DotsLoading } from "@/components/custom/Loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { normalizeCurrency } from "@/helpers/mask";
import { api } from "@/lib/axios";
import ModalCentrosCustos from "@/pages/financeiro/components/ModalCentrosCustos";
import ModalPlanosContas, {
  ItemPlanoContas,
} from "@/pages/financeiro/components/ModalPlanosContas";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowsUpFromLine } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { UseFormReturn, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { TituloCRSchemaProps } from "../../../form-data";
import { checkIfValidateBudget } from "../../../helpers/helper";
import { ItemRateioTituloCR } from "../../../store";

type PadronizarAlocacaoProps = {
  form: UseFormReturn<TituloCRSchemaProps>;
  canEdit?: boolean;
  disabled?: boolean;
};

const ButtonAction = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <Button {...props} ref={ref} variant="tertiary" size="sm" className="group">
      <ArrowsUpFromLine size={18} className="me-2 group-hover:rotate-180 transition-all" />
      Padronizar Alocação
    </Button>
  );
});

export function BtnPadronizarAlocacao({ form, canEdit }: PadronizarAlocacaoProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const id_grupo_economico = form.watch("id_grupo_economico");

  const [modalCentrosCustosOpen, setModalCentrosCustosOpen] = useState<boolean>(false);
  const [modalPlanoContasOpen, setModalPlanoContasOpen] = useState<boolean>(false);
  const [saldoOrcamento, setSaldoOrcamento] = useState<number>(0);

  type Feedback = {
    variant?: "success" | "warning" | "destructive" | "default" | null;
    title: string;
    description?: string;
  };
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [validarOrcamento, setValidarOrcamento] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const itens_rateio = useWatch({
    name: "itens_rateio",
    control: form.control,
  });

  const padronizacaoSchema = z.object({
    id_centro_custo: z.coerce.string(),
    centro_custo: z.coerce.string(),
    id_plano_conta: z.coerce.string(),
    plano_conta: z.coerce.string(),
  });

  const formPadronizacao = useForm({
    resolver: zodResolver(padronizacaoSchema),
    values: {
      id_centro_custo: "",
      centro_custo: "SELECIONE",
      id_plano_conta: "",
      plano_conta: "SELECIONE",
    },
    defaultValues: {
      id_centro_custo: "",
      centro_custo: "SELECIONE",
      id_plano_conta: "",
      plano_conta: "SELECIONE",
    },
  });
  // const { errors } = formPadronizacao.formState
  // console.log('Erros padronizar alocação', errors)

  // * WATCHES
  const id_centro_custo = formPadronizacao.watch("id_centro_custo");
  const id_plano_conta = formPadronizacao.watch("id_plano_conta");

  function handleSelectionCentroCusto(item: CentroCustos) {
    formPadronizacao.setValue("id_centro_custo", item.id);
    formPadronizacao.setValue("centro_custo", item.nome);
    setModalCentrosCustosOpen(false);
  }

  function handleSelectionPlanoContas(item: ItemPlanoContas) {
    const planoContas = `${item.codigo} - ${item.descricao}`;
    formPadronizacao.setValue("id_plano_conta", `${item.id}`);
    formPadronizacao.setValue("plano_conta", planoContas);
    setModalPlanoContasOpen(false);
  }

  // * [ORÇAMENTO]
  const valorTotalItens: number =
    itens_rateio?.reduce((acc: number, curr: { valor: string }) => {
      return acc + parseFloat(curr.valor);
    }, 0) || 0;

  const valorExcessoOrcamento = valorTotalItens - saldoOrcamento;
  const excedeOrcamento = saldoOrcamento < valorTotalItens;
  const saldoFuturoOrcamento = saldoOrcamento - valorTotalItens;

  type FetchOrcamento = {
    id_grupo_economico: number | string;
    id_centro_custo: number | string;
    id_plano_conta: number | string;
  };
  const fetchOrcamento = async (props: FetchOrcamento) => {
    try {
      setIsFetching(true);
      const result = await api.get("/financeiro/orcamento/find-account", {
        params: { ...props },
      });

      const contaOrcamento = result.data;

      const aplicarOrcamento = checkIfValidateBudget(contaOrcamento);
      setValidarOrcamento(aplicarOrcamento);

      const valOrcamento = parseFloat(contaOrcamento.saldo);
      setSaldoOrcamento(valOrcamento);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao buscar valor do orçamento",
        // @ts-ignore
        description: error?.response?.data?.message || error.message,
      });
      setSaldoOrcamento(0);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (id_grupo_economico && id_centro_custo && id_plano_conta) {
      fetchOrcamento({ id_grupo_economico, id_centro_custo, id_plano_conta });
    } else {
      setSaldoOrcamento(0);
    }
  }, [id_centro_custo, id_plano_conta]);

  useEffect(() => {
    if (!id_centro_custo) {
      setFeedback({
        variant: "destructive",
        title: "Preencha o valor",
      });
      return;
    }
    if (!id_plano_conta) {
      setFeedback({
        variant: "destructive",
        title: "Preencha o percentual",
      });
      return;
    }
    if (validarOrcamento && excedeOrcamento) {
      setFeedback({
        variant: "destructive",
        title: "Orçamento excedido!",
        description: `O valor excede o orçamento em ${normalizeCurrency(valorExcessoOrcamento)}`,
      });
      return;
    }

    setFeedback({
      variant: "success",
      title: "Tudo certo",
    });
  }, [id_centro_custo, id_plano_conta, saldoOrcamento]);

  const onSubmit = (data: z.infer<typeof padronizacaoSchema>) => {
    try {
      // setar para todos os itens_rateio os dados de centro de custo e plano de contas
      const novos_itens: ItemRateioTituloCR[] = [];
      itens_rateio?.forEach((item: ItemRateioTituloCR) => {
        novos_itens.push({
          ...item,
          percentual: String(parseFloat(item.percentual)),
          ...data,
        });
      });
      // @ts-ignore
      form.setValue("itens_rateio", novos_itens);
      form.setValue("update_rateio", true);

      formPadronizacao.reset();
      setModalOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ops!",
        description: error.message,
      });
    }
  };

  const btnDisabled = validarOrcamento && saldoOrcamento < valorTotalItens;

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <ButtonAction
          disabled={!canEdit || itens_rateio?.length === 0}
          type="button"
          onClick={() => {
            setModalOpen(true);
          }}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...formPadronizacao}>
          <form
            onSubmit={(e) => {
              formPadronizacao.handleSubmit(onSubmit)(e);
              e.stopPropagation();
            }}
          >
            <DialogHeader>
              <DialogTitle>Padronização de Alocação</DialogTitle>
              <DialogDescription>
                Todos os itens do rateio receberão o mesmo centro de custos e plano de contas.
                <br />
                Validaremos o saldo de orçamento para o total dos itens.
              </DialogDescription>
            </DialogHeader>

            <ModalPlanosContas
              open={modalPlanoContasOpen && !!id_grupo_economico}
              id_grupo_economico={id_grupo_economico}
              tipo="Despesa"
              //@ts-ignore
              onOpenChange={setModalPlanoContasOpen}
              handleSelection={handleSelectionPlanoContas}
            />

            <ModalCentrosCustos
              handleSelection={handleSelectionCentroCusto}
              id_grupo_economico={id_grupo_economico}
              // @ts-expect-error 'Vai funcionar'
              onOpenChange={setModalCentrosCustosOpen}
              open={modalCentrosCustosOpen && !!id_grupo_economico}
              closeOnSelection={true}
            />

            <div className="flex flex-col gap-3 py-4">
              <span onClick={() => setModalCentrosCustosOpen(true)}>
                <FormInput
                  name="centro_custo"
                  label="Centro de Custo"
                  placeholder="SELECIONE"
                  readOnly
                  control={formPadronizacao.control}
                />
              </span>
              <span onClick={() => setModalPlanoContasOpen(true)}>
                <FormInput
                  name="plano_conta"
                  label="Plano de Contas"
                  placeholder="SELECIONE"
                  readOnly
                  control={formPadronizacao.control}
                />
              </span>

              {isFetching ? (
                <div className="w-full flex justify-center">
                  <DotsLoading size={3} />
                </div>
              ) : (
                validarOrcamento && (
                  <>
                    <div className="flex gap-3 text-muted-foreground">
                      <span>Saldo Orçamento</span>
                      <span>{normalizeCurrency(saldoOrcamento)}</span>
                    </div>
                    <div className="flex gap-3 text-muted-foreground">
                      <span>Saldo Orçamento Futuro</span>
                      <span>{normalizeCurrency(saldoFuturoOrcamento)}</span>
                    </div>
                    <div className="flex gap-3 text-muted-foreground">
                      <span>Será consumido</span>
                      <span>{normalizeCurrency(valorTotalItens)}</span>
                    </div>
                  </>
                )
              )}

              <div className="flex gap-3">
                {feedback && (
                  <Alert variant={feedback.variant}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{feedback.title}</AlertTitle>
                    {feedback.description && (
                      <AlertDescription>{feedback.description}</AlertDescription>
                    )}
                  </Alert>
                )}
              </div>
            </div>

            <DialogFooter>
              <ButtonAction disabled={btnDisabled} type={"submit"} />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
