import { Button } from "@/components/ui/button";
import { ModalRecebimentoManual } from "@/pages/financeiro/contas-receber/recebimentos/modais/ModalRecebimentoManual";
import { useStoreRecebimentos } from "@/pages/financeiro/contas-receber/recebimentos/store";
import { Plus } from "lucide-react";

const ButtonNovoRecebimentoManual = ({
  id_vencimento,
  id_matriz,
}: {
  id_vencimento: string;
  id_matriz: string;
}) => {
  const openModalRecebimentoManual = useStoreRecebimentos().openModalRecebimentoManual;

  return (
    <span>
      <Button
        onClick={() =>
          openModalRecebimentoManual({
            id_matriz: id_matriz || "",
            id_vencimento: id_vencimento || "",
          })
        }
      >
        <Plus className="me-2" size={18} /> Recebimento Manual
      </Button>
      <ModalRecebimentoManual />
    </span>
  );
};

export default ButtonNovoRecebimentoManual;
