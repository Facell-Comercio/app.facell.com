import { Button } from "@/components/ui/button"
import { useStoreRateio } from "./context"
import { Plus } from "lucide-react"
import { Control, useWatch } from "react-hook-form"

export function BtnNovoItemRateio({ control }: { control: Control<any> }) {

    const id_filial = useWatch({
        name: 'id_filial',
        control: control
    })

    const id_rateio = useWatch({
        name: 'id_rateio',
        control: control
    })

    const rateio_manual = useWatch({
        name: 'rateio_manual',
        control: control
    })

    const newItemRateio = useStoreRateio().newItemRateio
    const disabled = !id_filial || (!!id_rateio && !rateio_manual);

    return (
        <Button disabled={disabled} type="button" size={'sm'} onClick={newItemRateio}><Plus size={18} className="me-2" /> Add Item</Button>
    )
}
