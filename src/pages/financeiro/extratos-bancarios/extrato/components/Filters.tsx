import ModalContasBancarias from "@/pages/financeiro/components/ModalContasBancarias";
import { ContaBancaria, useExtratoStore } from "./context";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Search, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import ButtonImport from "./ButtonImport";
import { DatePickerWithRange } from "@/components/ui/date-range";

const Filters = ({refetch, isFetching}:{refetch: ()=>void, isFetching: boolean}) => {

    const contaBancaria = useExtratoStore().contaBancaria
    const setContaBancaria = useExtratoStore().setContaBancaria
    const periodo = useExtratoStore().periodo
    const setPeriodo = useExtratoStore().setPeriodo

    const modalOpen = useExtratoStore().modalOpen
    const toggleModal = useExtratoStore().toggleModal

    const handleSelectionContaBancaria = (conta: ContaBancaria) => {
        setContaBancaria(conta)
    }
   
    return (
        <div className="flex flex-wrap">
            {!contaBancaria ? (
                <div className="flex gap-2 items-center">
                    <span>Selecione a conta bancária</span>
                    <Button variant={'tertiary'} onClick={toggleModal}><Search size={18} className="me-2" /> Procurar</Button>
                </div>
            ) : (
                <div className="flex flex-wrap gap-3 items-end">
                    <div>
                        <span className="text-gray-500 text-sm font-medium">Banco</span>
                        <Input className="font-semibold min-w-[20ch]" readOnly={true}
                            value={contaBancaria.banco}
                        />
                    </div>
                    <div>
                        <span className="text-gray-500 text-sm font-medium">Conta bancária</span>
                        <Input className="font-semibold min-w-[40ch]" readOnly={true}
                            value={contaBancaria.descricao}
                        />
                    </div>
                    <Button  disabled={isFetching} variant={'outline'} onClick={toggleModal}><Settings2 size={18} className="me-2" /> Trocar</Button>
                    <ButtonImport />

                    <div>
                        <span className="text-gray-500 text-sm font-medium">Período</span>
                        <DatePickerWithRange disabled={isFetching} date={periodo} setDate={setPeriodo} />
                    </div>

                    <Button disabled={isFetching} onClick={()=>refetch()}><RefreshCcw size={20} className={isFetching ? 'animate-spin': ''}/></Button>
                </div>

            )}

            <ModalContasBancarias
                //@ts-ignore 
                handleSelecion={handleSelectionContaBancaria}
                onOpenChange={toggleModal}
                closeOnSelection={true}
                open={modalOpen} />
        </div>);
}

export default Filters;