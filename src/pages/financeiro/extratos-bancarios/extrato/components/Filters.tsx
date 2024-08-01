import SelectMes from "@/components/custom/SelectMes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ModalContasBancarias from "@/pages/financeiro/components/ModalContasBancarias";
import { RefreshCcw, Search, Settings2 } from "lucide-react";
import ButtonImport from "./ButtonImport";
import { ContaBancaria, useExtratoStore } from "./context";

const Filters = ({
  refetch,
  isFetching,
}: {
  refetch: () => void;
  isFetching: boolean;
}) => {
  const [
    modalOpen,
    toggleModal,
    contaBancaria,
    setContaBancaria,
    mes,
    setMes,
    ano,
    setAno,
  ] = useExtratoStore((state) => [
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
              className="font-semibold min-w-[40ch]"
              readOnly={true}
              value={contaBancaria.descricao}
            />
          </div>
          <Button
            disabled={isFetching}
            variant={"outline"}
            onClick={toggleModal}
          >
            <Settings2 size={18} className="me-2" /> Trocar
          </Button>
          <ButtonImport />

          <div>
            <span className="text-gray-500 text-sm font-medium">Mês</span>
            <SelectMes
              disabled={isFetching}
              value={mes}
              onValueChange={(mes) => setMes(mes)}
            />
          </div>

          <div>
            <span className="text-gray-500 text-sm font-medium">Ano</span>
            <Input
              type="number"
              min={2023}
              disabled={isFetching}
              value={ano}
              className="max-w-[10ch]"
              onChange={(value) => setAno(value.target.value)}
            />
          </div>

          <Button disabled={isFetching} onClick={() => refetch()}>
            <RefreshCcw
              size={20}
              className={isFetching ? "animate-spin" : ""}
            />
          </Button>
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
