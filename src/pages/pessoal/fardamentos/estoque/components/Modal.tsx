import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useStoreEstoque } from "./Store";
import { Form } from "react-router-dom";
import FormEstoqueFardamento from "./Form";
import ModalButtons from "@/components/custom/ModalButtons";
import { useEffect, useRef } from "react";
import { useFardamentos } from "@/hooks/useFardamentos";
import { Skeleton } from "@/components/ui/skeleton";



// initials
const ModalEstoque = () => {
    const modalOpen = useStoreEstoque().modalOpen;
    const closeModal = useStoreEstoque().closeModal;
    const modalEditing = useStoreEstoque().modalEditing;
    const editModal = useStoreEstoque().editModal;
    const id = useStoreEstoque().id; 
    const formRef = useRef(null);

    const { data, isLoading } = useFardamentos().getOne(id);
    const fardamentoData = data;

    function handleClickCancel() {
        editModal(false);
    }

    return (
        <Dialog open={modalOpen} onOpenChange={closeModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{"Abastecimento"}</DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                    {modalOpen && !isLoading ? (
                        <FormEstoqueFardamento/>
                    ) : (
                        <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
                            <Skeleton className="w-full row-span-1" />
                            <Skeleton className="w-full row-span-3" />
                        </div>
                    )}
                </ScrollArea>
                <DialogFooter>
                    <ModalButtons
                    id={id}
                    modalEditing={modalEditing}
                    edit={() => editModal(true)}
                    cancel={handleClickCancel}
                    formRef={formRef}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ModalEstoque; 