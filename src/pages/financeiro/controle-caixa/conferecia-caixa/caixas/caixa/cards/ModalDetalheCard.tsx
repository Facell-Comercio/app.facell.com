import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { useStoreCaixa } from "../store";
import { CaixaCardDetalheProps } from "./CaixaCards";
import RowVirtualizedDetalheCardDatasys from "./RowVirtualizedDetalheCardDatasys";
import RowVirtualizedDetalheCardReal from "./RowVirtualizedDetalheCardReal";

const ModalDetalheCard = () => {
  const [modalOpen, closeModal, id_caixa, type, title] = useStoreCaixa(
    (state) => [
      state.modalDetalheCardOpen,
      state.closeModalDetalheCard,
      state.id,
      state.type_detalhe,
      state.title_detalhe,
    ]
  );

  const { data } = useConferenciasCaixa().getCardDetalhe({
    id_caixa,
    type,
  });

  const newData: CaixaCardDetalheProps & Record<string, any> =
    {} as CaixaCardDetalheProps & Record<string, any>;

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

  function handleClickCancel() {
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Detalhes ${title}`}</DialogTitle>
        </DialogHeader>
        <section className="max-h-[70vh] grid sm:grid-cols-2 gap-3 overflow-auto scroll-thin">
          <div className="sm:col-span-1 px-2 py-1 border bg-slate-200 dark:bg-blue-950 rounded-lg">
            <h3 className="font-medium text-center mb-2">Dados Datasys</h3>
            <RowVirtualizedDetalheCardDatasys data={movimento_caixa} />
          </div>
          <div className="sm:col-span-1 px-2 py-1 border bg-slate-200 dark:bg-blue-950 rounded-lg">
            <h3 className="font-medium text-center mb-2">Dados Reais</h3>
            <RowVirtualizedDetalheCardReal
              data={dados_reais}
              columns={columns}
            />
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetalheCard;
