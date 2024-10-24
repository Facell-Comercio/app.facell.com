import { Button } from "@/components/ui/button";
import ModalVencimentosCR, {
  VencimentoCRProps,
} from "@/pages/financeiro/components/ModalVencimentosCR";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useStoreRecebimentos } from "../store";

const ButtonNovoRecebimentoManual = () => {
  const openModalRecebimentoManual = useStoreRecebimentos().openModalRecebimentoManual;
  const [modalVencimentoCROpen, setModalVencimentoCROpen] = useState(false);

  function handleSelectVencimento(vencimento: VencimentoCRProps) {
    openModalRecebimentoManual({
      id_matriz: vencimento.id_matriz || "",
      id_vencimento: vencimento.id || "",
    });
  }

  return (
    <span>
      <Button
        variant={"outline"}
        className="border-blue-200 dark:border-primary"
        onClick={() => setModalVencimentoCROpen(true)}
      >
        <Plus className="me-2" size={18} /> Recebimento Manual
      </Button>
      <ModalVencimentosCR
        handleSelection={handleSelectVencimento}
        open={modalVencimentoCROpen}
        initialFilters={{ status_vencimento_list: ["pendente", "pago parcial"] }}
        // @ts-ignore
        onOpenChange={() => setModalVencimentoCROpen(false)}
      />
    </span>
  );
};

export default ButtonNovoRecebimentoManual;
