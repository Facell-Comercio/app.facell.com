import { DataTable } from "@/components/custom/DataTable"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { columnsTableConcederVenderFardamento } from "./table-conceder/columns-estoque"
import { useStoreTableConcederVenderFardamento } from "./table-conceder/store-table"
import { useStoreConcederVenderFardamento } from "./Store"
import { Input } from "@/components/ui/input"
import ModalButtons from "@/components/custom/ModalButtons"
import { useRef } from "react"

export const ModalConcederVenderFardamento = () => {
    const modalOpen = useStoreConcederVenderFardamento().modalOpen;
    const closeModal = useStoreConcederVenderFardamento().closeModal;
    const modalEditing = useStoreConcederVenderFardamento().modalEditing;
    const editModal = useStoreConcederVenderFardamento().editModal;
    const formRef = useRef(null);
    const [pagination, setPagination] = useStoreTableConcederVenderFardamento((state) => [
        state.pagination,
        state.setPagination,
    ])
    const items = useStoreConcederVenderFardamento((state) => state.items);
    function handleClickCancel() {
        editModal(false);
        closeModal();
    }


    // Modal Users, mas para abrir a tabela juntamente com o filtro e no onClick pegar
    // o id e preencher os campos CPF e Nome com os dados do usuário clicado.
    return(
        <Dialog open={modalOpen} onOpenChange={closeModal}>
            <DialogContent>
                {/* Alterar de acordo com o método */}
                <DialogHeader>
                    <DialogTitle>{""}</DialogTitle>
                    <DialogDescription className=" hidden"/>
                </DialogHeader>
                <ScrollArea className=" max-h-[70vh]">
                    <div className="flex flex-row gap-2 mt-2 mb-4">
                        <Input
                        onClick={() => {}}>
                        </Input>
                        <Input>
                        </Input>
                    </div>
                    <DataTable
                      pagination={pagination}
                      setPagination={setPagination}
                      data={items}
                      rowCount={items.length}
                      columns={columnsTableConcederVenderFardamento}
                    />
                    <div className="mt-4">

                        <ModalButtons
                        id={""}
                        modalEditing={modalEditing}
                        cancel={handleClickCancel}
                        formRef={formRef}
                        />
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}