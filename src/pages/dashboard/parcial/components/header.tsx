import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range";
import { RefreshCcw, RotateCcw } from "lucide-react";
import { useParcialStore } from "./context";
import { checkUserPermission } from "@/helpers/checkAuthorization";

type ParcialHeaderProps = {
    refetch: any
}
const ParcialHeader = ({ refetch }: ParcialHeaderProps) => {
    const range_data = useParcialStore((state) => state.range_data)
    const setState = useParcialStore((state) => state.setState)
    const isMaster = checkUserPermission('MASTER') || checkUserPermission('COMERCIAL_DASHBOARD_ADMIN')

    return (
        <div className="flex gap-3">

            {isMaster &&
                <><DatePickerWithRange
                    date={range_data}
                    setDate={(newDate) => setState({ range_data: newDate })}
                    className="max-w-56"
                    toDate={new Date()}
                />
                    <Button onClick={() => setState({ range_data: {from: new Date(), to: new Date()}})}>
                        <RotateCcw size={18} className="me-2"/> Retomar Parcial
                    </Button>
                </>
            }
            <Button onClick={() => refetch()}>
                <RefreshCcw size={18} className="me-2" /> Atualizar
            </Button>
        </div>
    );
}

export default ParcialHeader;