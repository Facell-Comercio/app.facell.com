import { Input } from "@/components/ui/input";
import { ContaBancaria } from "../../../extrato/components/context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormNovoPadrao = ({conta}:{conta:ContaBancaria}) => {
    const [open, setOpen] = useState<boolean>(false);
    const toggleOpen = ()=>{
        setOpen(prev=>!prev)
    }
    const handleSavePadrao = ()=>{


        toggleOpen()
    }
    const handleClickCancel = ()=>{
        toggleOpen()
    }

    if(!conta){
        return null
    }

    return ( <form>
        {open ? (
            <div className="flex gap-3">
                <Input type="text" placeholder="DIGITE O NOVO PADRÃO" className="max-w-72"/>
                <Select defaultValue={'DEBIT'} value={'DEBIT'} onValueChange={(tipo_transacao: 'CREDIT' | 'DEBIT') =>null}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue defaultValue={'DEBIT'} placeholder="Selecione o Tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="DEBIT">DEBIT</SelectItem>
                                                <SelectItem value="CREDIT">CREDIT</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                <Button variant={'secondary'} onClick={handleClickCancel}>Cancelar</Button>
                <Button onClick={handleSavePadrao}>Salvar</Button>
            </div>
        ):(
            <Button disabled={!conta} onClick={toggleOpen}>Novo Padrão</Button>
        )}
    </form> );
}
 
export default FormNovoPadrao;