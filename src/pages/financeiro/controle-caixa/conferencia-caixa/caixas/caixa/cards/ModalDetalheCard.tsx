import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { normalizeCurrency } from "@/helpers/mask";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useStoreCaixa } from "../store";
import { CaixaCardDetalheProps } from "./CaixaCards";
import RowVirtualizedDetalheCardDatasys from "./RowVirtualizedDetalheCardDatasys";
import RowVirtualizedDetalheCardReal from "./RowVirtualizedDetalheCardReal";

const ModalDetalheCard = () => {
  const [modalOpen, closeModal, id_caixa, type, title] = useStoreCaixa((state) => [
    state.modalDetalheCardOpen,
    state.closeModalDetalheCard,
    state.id,
    state.type_detalhe,
    state.title_detalhe,
  ]);

  const { data } = useConferenciasCaixa().getCardDetalhe({
    id_caixa,
    type,
  });

  const newData: CaixaCardDetalheProps & Record<string, any> = {} as CaixaCardDetalheProps &
    Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newData[key] = String(data[key]);
    } else if (data[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = data[key];
    }
  }

  const { movimento_caixa, columns, dados_reais } = newData;
  const totalMovimentoCaixa = movimento_caixa?.reduce(
    (acc, item) => acc + parseFloat(item.valor || "0"),
    0
  );
  const totalDadosReais = dados_reais?.reduce(
    (acc: number, item: any) => acc + parseFloat(item?.valor || "0"),
    0
  );

  function handleClickCancel() {
    closeModal();
  }

  const hasMovimentoCaixa = movimento_caixa?.length > 0;
  const hasDadosReais = dados_reais?.length > 0;

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Detalhes ${title}`}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <section
          className={`max-h-[70vh] grid ${
            hasMovimentoCaixa && hasDadosReais && "sm:grid-cols-2"
          } gap-3 overflow-auto scroll-thin`}
        >
          {hasMovimentoCaixa && (
            <div className="sm:col-span-1 px-2 py-1 border bg-slate-200 dark:bg-blue-950 rounded-lg">
              <span className="flex items-center justify-between mb-2 px-1">
                <h3 className="font-medium text-center">Dados Datasys</h3>
                <Badge variant={"info"} className="w-fit">
                  Total: {normalizeCurrency(totalMovimentoCaixa)}
                </Badge>
              </span>

              <RowVirtualizedDetalheCardDatasys data={movimento_caixa} />
            </div>
          )}
          {hasDadosReais && (
            <div className="sm:col-span-1 px-2 py-1 border bg-slate-200 dark:bg-blue-950 rounded-lg">
              <span className="flex items-center justify-between mb-2 px-1">
                <h3 className="font-medium text-center">Dados Reais</h3>
                <Badge variant={"info"} className="w-fit">
                  Total: {normalizeCurrency(totalDadosReais)}
                </Badge>
              </span>
              <RowVirtualizedDetalheCardReal data={dados_reais} columns={columns} />
            </div>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetalheCard;
