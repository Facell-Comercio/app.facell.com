import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import FormNovoPadrao from "./padroes/form/Form";
import TablePadroes from "./padroes/table/TablePadroes";
import ModalContasBancarias from "../../components/ModalContasBancarias";
import { ContaBancaria } from "../extrato/components/context";
import { useState } from "react";


const ConfigTab = () => {
    const [modalContasOpen, setModalContasOpen] = useState<boolean>(false)
    const [contaBancaria, setContaBancaria] = useState<ContaBancaria | null>(null)

    const handleSelectionConta = (conta: ContaBancaria) => {
        setContaBancaria(conta)
    }

    return (
        <Accordion type="single" collapsible className="w-full mt-3">
            <AccordionItem value="item-1">
                <AccordionTrigger className="p-2 no-underline">Transações não conciliáveis - Padrões</AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col gap-3">
                        <div>
                            <ModalContasBancarias
                                open={modalContasOpen}
                                onOpenChange={setModalContasOpen}
                                closeOnSelection={true}
                                handleSelecion={handleSelectionConta}
                            />
                        </div>
                        <div>

                            <FormNovoPadrao conta={contaBancaria} />

                        </div>
                        <div>
                            <TablePadroes />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    );
}

export default ConfigTab;