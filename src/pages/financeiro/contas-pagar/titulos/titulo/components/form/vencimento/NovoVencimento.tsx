import { Button } from "@/components/ui/button"
import { useStoreVencimento } from "./context"
import { Plus } from "lucide-react"


export function BtnNovoVencimento() {
    const newVencimento = useStoreVencimento().newVencimento

    return (
        <Button type="button" onClick={newVencimento}><Plus size={18} className="me-2"/> Novo Vencimento</Button>
    )
}
