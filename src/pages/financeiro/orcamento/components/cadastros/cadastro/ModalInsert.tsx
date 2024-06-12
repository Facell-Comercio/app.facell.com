import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useStoreCadastro } from "./store";

import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ModalCentrosCustos from "@/pages/financeiro/components/ModalCentrosCustos";
import ModalPlanosContas, {
  ItemPlanoContas,
} from "@/pages/financeiro/components/ModalPlanosContas";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { Plus } from "lucide-react";
import { useState } from "react";

type newContaProps = {
  centro_custo: string;
  plano_contas: string;
  id_centro_custo: string;
  id_plano_contas: string;
  valor: string;
};

interface ModalInsertProps {
  addNewConta: (data: newContaProps) => void;
  id_grupo_economico: string;
}

const ModalInsert = ({ addNewConta, id_grupo_economico }: ModalInsertProps) => {
  const [modalPlanoContasOpen, setModalPlanoContasOpen] = useState(false);
  const [modalCentrosCustoOpen, setModalCentrosCustoOpen] = useState(false);
  const [newConta, setNewConta] = useState({
    centro_custo: "",
    plano_contas: "",
    id_centro_custo: "",
    id_plano_contas: "",
    valor: "",
  });

  const modalInsertOpen = useStoreCadastro().modalInsertOpen;
  const closeInsertModal = useStoreCadastro().closeInsertModal;

  function handleSelectionPlanoContas(item: ItemPlanoContas) {
    setNewConta({
      ...newConta,
      plano_contas: item.codigo + " - " + item.descricao,
      id_plano_contas: item.id,
    });
    setModalPlanoContasOpen(false);
  }

  function handleSelectionCentroCustos(item: CentroCustos) {
    setNewConta({
      ...newConta,
      centro_custo: item.nome,
      id_centro_custo: item.id,
    });
    setModalCentrosCustoOpen(false);
  }

  function onAddNewConta() {
    if (
      !newConta.id_centro_custo ||
      !newConta.id_plano_contas ||
      !newConta.valor
    ) {
      toast({
        title: "Valores insuficientes!",
        description:
          "É necessário que sejam indicados o centro de custos, o plano de contas, e o valor da nova conta",
        variant: "warning",
      });
      return;
    }
    setNewConta({
      centro_custo: "",
      plano_contas: "",
      id_centro_custo: "",
      id_plano_contas: "",
      valor: "",
    });
    addNewConta(newConta);
  }

  return (
    <div>
      <Dialog open={modalInsertOpen} onOpenChange={() => closeInsertModal()}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <div className="text-base font-medium">Inserir uma Nova Conta</div>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <div className={`flex gap-3`}>
              <div
                className="flex-1 flex gap-1 flex-col"
                onClick={() => setModalCentrosCustoOpen(true)}
              >
                <label className="text-sm font-medium">Centro de Custo</label>

                <Input
                  placeholder="Selecione..."
                  defaultValue={newConta.centro_custo && newConta.centro_custo}
                />
              </div>
              <div
                className="flex-1 flex gap-1 flex-col"
                onClick={() => setModalPlanoContasOpen(true)}
              >
                <label className="text-sm font-medium">Plano de Contas</label>
                <Input
                  placeholder="Selecione..."
                  defaultValue={newConta.plano_contas && newConta.plano_contas}
                />
              </div>
              <ModalPlanosContas
                open={modalPlanoContasOpen}
                id_grupo_economico={id_grupo_economico}
                tipo="Despesa"
                onOpenChange={() =>
                  setModalPlanoContasOpen((prev: boolean) => !prev)
                }
                handleSelection={handleSelectionPlanoContas}
              />
              <ModalCentrosCustos
                handleSelection={handleSelectionCentroCustos}
                // @ts-expect-error 'Ignore, vai funcionar..'
                onOpenChange={setModalCentrosCustoOpen}
                open={modalCentrosCustoOpen}
                id_grupo_economico={id_grupo_economico}
                closeOnSelection={true}
              />
              <div className="flex-1 flex gap-1 flex-col">
                <label className="text-sm font-medium">Valor</label>

                <Input
                  type="number"
                  placeholder="10,99"
                  value={newConta.valor}
                  step={"0.01"}
                  onChange={(e) =>
                    setNewConta({ ...newConta, valor: e.target.value })
                  }
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => onAddNewConta()}>
              <Plus className="me-2" />
              Inserir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalInsert;
