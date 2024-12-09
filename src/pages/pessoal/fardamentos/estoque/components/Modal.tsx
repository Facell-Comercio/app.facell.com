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


// initials
const ModalEstoque = () => {
    const modalOpen = useStoreEstoque().modalOpen;
    const closeModal = useStoreEstoque().closeModal;
    const modalEditing = useStoreEstoque().modalEditing;
    const editModal = useStoreEstoque().editModal;

    return (
        <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{"Abastecimento"}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <ScrollArea>
                </ScrollArea>
            <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
