import { Button } from "@/components/ui/button";
import { ModalRecebimentoBancario } from "@/pages/financeiro/contas-receber/recebimentos/modais/ModalRecebimentoBancario";
import { useStoreRecebimentos } from "@/pages/financeiro/contas-receber/recebimentos/store";
import { Plus } from "lucide-react";

const ButtonNovoRecebimentoBancario = (data: { id_vencimento: string; id_matriz: string }) => {
  const openModalRecebimentoBancario = useStoreRecebimentos().openModalRecebimentoBancario;

  return (
    <span>
      <Button variant={"tertiary"} onClick={() => openModalRecebimentoBancario(data)}>
        <Plus className="me-2" size={18} /> Recebimento Bancário
      </Button>
      <ModalRecebimentoBancario />
    </span>
  );
};

export default ButtonNovoRecebimentoBancario;
