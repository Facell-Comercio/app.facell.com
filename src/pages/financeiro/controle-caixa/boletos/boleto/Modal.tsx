// import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

// import ModalButtons from "@/components/custom/ModalButtons";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useOrcamento } from "@/hooks/financeiro/useOrcamento";
// import { ScrollArea } from "@radix-ui/react-scroll-area";
// import { CircleFadingPlusIcon } from "lucide-react";
// import { useRef } from "react";
// import FormBoleto from "./Form";
// import { useStoreBoleto } from "./store";

// const ModalBoleto = () => {
//   const modalOpen = useStoreBoleto().modalOpen;
//   // const closeModal = useStoreBoleto().closeModal;
//   const toggleModal = useStoreBoleto().toggleModal;
//   const openReplicateModal = useStoreBoleto().openReplicateModal;
//   const [modalEditing, editModal, isPending] = useStoreBoleto((state) => [
//     state.modalEditing,
//     state.editModal,
//     state.isPending,
//   ]);

//   const id = useStoreBoleto().id;
//   const formRef = useRef(null);

//   const { data, isLoading } = useOrcamento().getOne(id);

//   const newData: boletoSchemaProps & Record<string, any> =
//     {} as boletoSchemaProps & Record<string, any>;

//   for (const key in data?.data) {
//     if (typeof data?.data[key] === "number") {
//       newData[key] = String(data?.data[key]);
//     } else if (data?.data[key] === null) {
//       newData[key] = "";
//     } else {
//       newData[key] = data?.data[key];
//     }
//   }

//   function handleClickCancel() {
//     editModal(false);
//     // closeModal();
//   }

//   return (
//     <div>
//       <Dialog open={modalOpen} onOpenChange={toggleModal}>
//         <DialogContent>
//           <ScrollArea className="max-h-[80vh]">
//             {modalOpen && !isLoading ? (
//               <FormBoleto
//                 id={id}
//                 data={id ? newData : initialPropsBoleto}
//                 formRef={formRef}
//               />
//             ) : (
//               <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
//                 <Skeleton className="w-full row-span-1" />
//                 <Skeleton className="w-full row-span-3" />
//               </div>
//             )}
//           </ScrollArea>
//           <DialogFooter>
//             <ModalButtons
//               id={id}
//               modalEditing={modalEditing}
//               edit={() => editModal(true)}
//               cancel={handleClickCancel}
//               formRef={formRef}
//               isLoading={isPending}
//             >
//               <Button
//                 type={"submit"}
//                 size="lg"
//                 variant={"secondary"}
//                 disabled={isPending}
//                 className="dark:text-white justify-self-start	mx-3"
//                 onClick={() => openReplicateModal(id || "")}
//               >
//                 <CircleFadingPlusIcon className="me-2" />
//                 Replicar
//               </Button>
//             </ModalButtons>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ModalBoleto;
