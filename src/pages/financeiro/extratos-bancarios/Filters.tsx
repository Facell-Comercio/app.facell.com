import SelectMes from "@/components/custom/SelectMes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ModalContasBancarias from "@/pages/financeiro/components/ModalContasBancarias";
import { Search } from "lucide-react";
import { ContaBancaria } from "./extrato/components/context";
import { useExtratosStore } from "./context";

const Filters = () => {
  const [
    modalOpen,
    toggleModal,
    contaBancaria,
    setContaBancaria,
    mes,
    setMes,
    ano,
    setAno,
  ] = useExtratosStore((state) => [
    state.modalOpen,
    state.toggleModal,
    state.contaBancaria,
    state.setContaBancaria,
    state.mes,
    state.setMes,
    state.ano,
    state.setAno,
  ]);

  const handleSelectionContaBancaria = (conta: ContaBancaria) => {
    setContaBancaria(conta);
  };

  return (
    <div className="flex flex-wrap">
      {!contaBancaria ? (
        <div className="flex gap-1.5 w-full items-center">
          <Input
            placeholder="Selecione a conta bancária"
            onClick={toggleModal}
            readOnly
          />
          <Button variant={"tertiary"} onClick={toggleModal}>
            <Search size={18} className="me-2" /> Procurar
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <span className="text-gray-500 text-sm font-medium">Banco</span>
            <Input
              onClick={toggleModal}
              className="font-semibold min-w-[20ch]"
              readOnly={true}
              value={contaBancaria.banco}
            />
          </div>
          <div>
            <span className="text-gray-500 text-sm font-medium">
              Conta bancária
            </span>
            <Input
              onClick={toggleModal}
              className="font-semibold min-w-[40ch]"
              readOnly={true}
              value={contaBancaria.descricao}
            />
          </div>

          <div>
            <span className="text-gray-500 text-sm font-medium">Mês</span>
            <SelectMes
              value={mes}
              onValueChange={(mes) => setMes(mes)}
            />
          </div>

          <div>
            <span className="text-gray-500 text-sm font-medium">Ano</span>
            <Input
              type="number"
              min={2023}
              value={ano}
              className="max-w-[10ch]"
              onChange={(value) => setAno(value.target.value)}
            />
          </div>
          
        </div>
      )}

      <ModalContasBancarias
        //@ts-ignore
        handleSelection={handleSelectionContaBancaria}
        onOpenChange={toggleModal}
        closeOnSelection={true}
        open={modalOpen}
      />
    </div>
  );
};

export default Filters;
