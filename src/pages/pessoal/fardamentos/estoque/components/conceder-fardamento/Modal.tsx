import { DataTable } from "@/components/custom/DataTable"
import ModalButtons from "@/components/custom/ModalButtons"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { columnsTableConcederVenderFardamento } from "./table-conceder/columns-estoque"

const ModalConcederVenderFardamento = () => {
    
    return(
        <Dialog open={} onOpenChange={}>
            <DialogContent>
                {/* Alterar d acordo com o método */}
                <DialogHeader>
                    <DialogTitle>{""}</DialogTitle>
                    <DialogDescription className=" hidden"/>
                </DialogHeader>
                <ScrollArea className=" max-h-[70vh]">
                    <DataTable
                      pagination={}
                      setPagination={}
                      data={}
                      rowCount={}
                      columns={columnsTableConcederVenderFardamento}
                    />
                </ScrollArea>
                <ModalButtons
                    edit={() => }
                    modalEditing={}
                    cancel={}
                    />
            </DialogContent>
        </Dialog>
    )
}