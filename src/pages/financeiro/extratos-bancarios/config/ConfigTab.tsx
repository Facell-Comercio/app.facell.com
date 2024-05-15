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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Settings2 } from "lucide-react";


const ConfigTab = () => {
    const [modalContasOpen, setModalContasOpen] = useState<boolean>(false)
    const [contaBancaria, setContaBancaria] = useState<ContaBancaria | null>(null)

    const toggleModalContasBancarias = () => {
        setModalContasOpen(prev => !prev)
    }
    const handleSelectionConta = (conta: ContaBancaria) => {
        setContaBancaria(conta)
    }

    return (
        <Accordion type="single" collapsible className=" mt-3">
            <AccordionItem value="item-1">
                <AccordionTrigger className="p-2 hover:no-underline">Transações não conciliáveis - Padrões</AccordionTrigger>
                <AccordionContent className="p-2">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap">
                            {!contaBancaria ? (
                                <div className="flex gap-2 items-center">
                                    <span>Selecione a conta bancária</span>
                                    <Button variant={'tertiary'} onClick={toggleModalContasBancarias}><Search size={18} className="me-2" /> Procurar</Button>
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
                                    <Button variant={'outline'} onClick={toggleModalContasBancarias}><Settings2 size={18} className="me-2" /> Trocar</Button>
                                </div>
                            )}

                            <ModalContasBancarias
                                //@ts-ignore 
                                handleSelection={handleSelectionConta}
                                onOpenChange={toggleModalContasBancarias}
                                closeOnSelection={true}
                                open={modalContasOpen}
                            />
                        </div>
                        {
                            contaBancaria && (
                                <>
                                    <div>
                                        <FormNovoPadrao conta={contaBancaria} />
                                    </div>
                                    <div>
                                        <TablePadroes conta={contaBancaria} />
                                    </div>
                                </>
                            )
                        }

                    </div>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    );
}

export default ConfigTab;