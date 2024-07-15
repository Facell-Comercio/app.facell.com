import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useStoreCadastro } from "./store";

import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ModalCentrosCustos from "@/pages/financeiro/components/ModalCentrosCustos";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import ModalMultiPlanosContas from "./ModalMultiPlanosContas";

export type newContasProps = {
  centro_custo: string;
  plano_contas: string;
  id_centro_custo: string;
  id_plano_contas: string;
  valor: string;
  saldo: string;
  realizado: string;
};

interface ModalMultiInsertProps {
  addNewConta: (data: newContasProps) => void;
  id_grupo_economico: string;
  data: newContasProps[];
}

const ModalMultiInsert = ({
  addNewConta,
  id_grupo_economico,
  data,
}: ModalMultiInsertProps) => {
  const [modalCentrosCustoOpen, setModalCentrosCustoOpen] = useState(false);
  const [centroCusto, setCentroCusto] = useState({
    id: "",
    nome: "",
  });

  const [
    closeMultiInsertModal,
    modalMultiInsertOpen,
    openMultiPlanoContasModal,
    closeMultiPlanoContasModal,
    modalMultiPlanoContasOpen,
  ] = useStoreCadastro((state) => [
    state.closeMultiInsertModal,
    state.modalMultiInsertOpen,
    state.openMultiPlanoContasModal,
    state.closeMultiPlanoContasModal,
    state.modalMultiPlanoContasOpen,
  ]);

  function handleSelectionCentroCustos(item: CentroCustos) {
    setCentroCusto({
      nome: item.nome,
      id: item.id,
    });
    setModalCentrosCustoOpen(false);
  }

  useEffect(() => {
    if (!modalMultiInsertOpen) {
      setCentroCusto({
        nome: "",
        id: "",
      });
    }
  }, [modalMultiInsertOpen]);

  function onAddNewConta() {
    if (!centroCusto.id) {
      toast({
        title: "Valores insuficientes!",
        description: "É necessário que o centro de custo seja definido",
        variant: "warning",
      });
      return;
    }

    openMultiPlanoContasModal();
  }

  const filteredData = data.filter(
    (item) => item.id_centro_custo === centroCusto.id
  );

  return (
    <div>
      <Dialog
        open={modalMultiInsertOpen}
        onOpenChange={() => closeMultiInsertModal()}
      >
        <DialogContent className="max-w-xl w-max">
          <DialogHeader>
            <div className="text-base font-medium">Inserir Novas Contas</div>
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
                  defaultValue={centroCusto.nome && centroCusto.nome}
                />
              </div>

              <ModalCentrosCustos
                handleSelection={handleSelectionCentroCustos}
                // @ts-expect-error 'Ignore, vai funcionar..'
                onOpenChange={setModalCentrosCustoOpen}
                open={modalCentrosCustoOpen}
                id_grupo_economico={id_grupo_economico}
                closeOnSelection={true}
              />
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => onAddNewConta()}>
              Planos de Contas
              <ChevronRight className="ms-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
        <ModalMultiPlanosContas
          open={modalMultiPlanoContasOpen}
          id_centro_custo={centroCusto.id}
          centro_custo={centroCusto.nome}
          id_grupo_economico={id_grupo_economico}
          tipo="Despesa"
          onOpenChange={() => {
            closeMultiPlanoContasModal();
            closeMultiInsertModal();
          }}
          addNewConta={addNewConta}
          contas={filteredData}
        />
      </Dialog>
    </div>
  );
};

export default ModalMultiInsert;
