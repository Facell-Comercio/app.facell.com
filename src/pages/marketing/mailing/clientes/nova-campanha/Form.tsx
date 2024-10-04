// import FormInput from "@/components/custom/FormInput";
// import { Form } from "@/components/ui/form";
// import { useOrcamento } from "@/hooks/financeiro/useOrcamento";
// import ModalCentrosCustos from "@/pages/financeiro/components/ModalCentrosCustos";
// import ModalPlanosContas from "@/pages/financeiro/components/ModalPlanosContas";
// import { ChevronDown } from "lucide-react";
// import { useState } from "react";
// import { NovaCampanhaSchema, useFormNovaCampanhaData } from "./form-data";
// import { useStoreNovaCampanha } from "./store";

// const FormNovaCampanha = ({
//   data,
//   formRef,
// }: {
//   id: string | null | undefined;
//   data: NovaCampanhaSchema;
//   formRef: React.MutableRefObject<HTMLFormElement | null>;
// }) => {
//   const [modalCentrosCustoOpen, setModalCentrosCustoOpen] = useState(false);
//   const [modalPlanoContasOpen, setModalPlanoContasOpen] = useState(false);
//   const { mutate: transfer } = useOrcamento().transfer();
//   const closeModal = useStoreNovaCampanha().closeModal;
//   const { form } = useFormNovaCampanhaData(data);

//   const onSubmitData = (data: NovaCampanhaSchema) => {
//     transfer(data);
//     closeModal();
//   };

//   // console.log(form.formState.errors);

//   return (
//     <div className="max-w-full overflow-x-hidden">
//       <Form {...form}>
//         <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
//           <div className="max-w-full flex flex-col lg:flex-row gap-5">
//             <div className="flex flex-1 flex-col gap-1 shrink-0">
//               {/* Primeira coluna */}
//               <div className="flex flex-col gap-3 p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
//                 <h3 className="text-lg font-medium">Conta de Saída</h3>
//                 <div className="flex flex-wrap gap-3 ">
//                   <FormInput
//                     className="min-w-[30ch] sm:flex-1"
//                     name="centro_custo_entrada"
//                     readOnly={true}
//                     label="Centro de Custo"
//                     control={form.control}
//                   />
//                   <FormInput
//                     className="min-w-[30ch] sm:flex-1 sm:min-w-[40ch]"
//                     name="conta_saida"
//                     readOnly={true}
//                     label="Plano de Contas"
//                     control={form.control}
//                   />
//                   <FormInput
//                     type="number"
//                     className="flex-1 w-full sm:max-w-[20ch]"
//                     name="disponivel"
//                     readOnly={true}
//                     label="Valor Disponível"
//                     control={form.control}
//                   />
//                 </div>
//               </div>
//               <div className="flex items-center justify-center w-full">
//                 <ChevronDown size={30} />
//               </div>
//               {/* Segunda coluna */}
//               <div className="flex flex-col gap-3 p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
//                 <h3 className="text-lg font-medium">Conta de Entrada</h3>
//                 <div className="flex flex-wrap gap-3 min-w-[30ch]">
//                   <span className="flex-1" onClick={() => setModalCentrosCustoOpen(true)}>
//                     <FormInput
//                       className="w-full"
//                       name="centro_custo_entrada"
//                       placeholder="Selecione o centro de custo"
//                       label="Centro de Custo"
//                       control={form.control}
//                     />
//                   </span>
//                   <ModalCentrosCustos
//                     handleSelection={handleSelectionCentroCustos}
//                     // @ts-expect-error 'Ignore, vai funcionar..'
//                     onOpenChange={setModalCentrosCustoOpen}
//                     open={modalCentrosCustoOpen}
//                     id_grupo_economico={data.id_grupo_economico}
//                     closeOnSelection={true}
//                   />

//                   <span
//                     className="flex-1 min-w-[30ch]"
//                     onClick={() => setModalPlanoContasOpen(true)}
//                   >
//                     <FormInput
//                       className="w-full"
//                       name="conta_entrada"
//                       label="Plano de Contas"
//                       placeholder="Selecione a conta"
//                       control={form.control}
//                     />
//                   </span>
//                   <ModalPlanosContas
//                     open={modalPlanoContasOpen}
//                     id_grupo_economico={data.id_grupo_economico}
//                     tipo="Despesa"
//                     onOpenChange={() => setModalPlanoContasOpen((prev: boolean) => !prev)}
//                     handleSelection={handleSelectionPlanoContas}
//                   />
//                   <FormInput
//                     type="number"
//                     className="flex-1 w-full sm:max-w-[20ch]"
//                     name="valor_transferido"
//                     label="Valor a Transferir"
//                     placeholder={(+data.disponivel).toFixed(2).replace(".", ",")}
//                     min={0.1}
//                     max={+data.disponivel}
//                     control={form.control}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default FormNovaCampanha;
