import FormInput from "@/components/custom/FormInput";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "@/components/ui/use-toast";
import { usePerfil } from "@/hooks/adm/usePerfil";
import { Permissao } from "@/types/permissao-type";
import { Info, List, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import ModalPermissoes from "../../components/ModalPermissoes";
import { PerfilFormData, useFormPerfilData } from "./form-data";
import { useStorePerfil } from "./store";

const FormUsers = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: PerfilFormData;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertOneIsPending,
    isSuccess: insertOneIsSuccess,
    isError: insertOneIsError,
  } = usePerfil().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = usePerfil().update();

  const [modalEditing, editModal, closeModal, isPending, editIsPending] = useStorePerfil(
    (state) => [
      state.modalEditing,
      state.editModal,
      state.closeModal,
      state.isPending,
      state.editIsPending,
    ]
  );

  const [modalPermissaoOpen, setModalPermissaoOpen] = useState(false);

  const { form } = useFormPerfilData(data);
  const {
    fields: permissoes,
    append: addPermissao,
    remove: removePermisao,
  } = useFieldArray({
    name: "permissoes",
    control: form.control,
  });

  const handleSelectPermissao = (permissao: Permissao) => {
    // verifica se o cara já possui

    const indexPermissao = permissoes?.findIndex((f) => f.id_permissao == permissao.id);
    if (indexPermissao === -1) {
      // setar a permissao
      form.setValue("updatePermissoes", false);
      // @ts-ignore
      addPermissao({
        id: "",
        id_permissao: permissao.id || "",
        // @ts-ignore
        id_user: id,
        nome: permissao.nome,
        modulo: permissao.modulo,
      });
    } else {
      toast({
        title: "Não foi possível adicionar!",
        description: "A permissão já consta na lista",
        variant: "warning",
      });
    }
  };

  // function handleSelectPermissao(permissao: Permissao) {
  //   addPermisao(permissao);
  //   form.setValue("updatePermissoes", 1);
  // }

  const onSubmitData = (newData: PerfilFormData) => {
    if (id) update(newData);
    if (!id) insertOne(newData);
  };

  const isActive = !!+form.watch("active");

  useEffect(() => {
    if (insertOneIsSuccess) {
      closeModal();
      editModal(false);
      editIsPending(false);
    } else if (insertOneIsError) {
      editIsPending(false);
    } else if (insertOneIsPending) {
      editIsPending(true);
    }
  }, [insertOneIsPending]);

  useEffect(() => {
    if (updateIsSuccess) {
      closeModal();
      editModal(false);
      editIsPending(false);
    } else if (updateIsError) {
      editIsPending(false);
    } else if (updateIsPending) {
      editIsPending(true);
    }
  }, [updateIsPending]);

  return (
    <div className="max-w-full ">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmitData)}
          className="flex flex-col gap-3"
        >
          <section className="flex flex-col gap-3 w-full p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
            <div className="flex font-medium items-center text-lg">
              <Info className="me-2" /> Dados
            </div>
            <div className="flex w-full items-end gap-3 ">
              <FormInput
                control={form.control}
                label="Nome"
                name="perfil"
                inputClass="uppercase"
                readOnly={!modalEditing || isPending}
              />
              <Toggle
                variant={"active"}
                className="w-20"
                pressed={isActive}
                disabled={!modalEditing || isPending}
                onPressedChange={(value) => form.setValue("active", +!!value)}
              >
                {isActive ? "ATIVO" : "INATIVO"}
              </Toggle>
            </div>
          </section>
          <section className="flex flex-col gap-3 w-full p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
            <div className="flex justify-between">
              <span className="flex font-medium items-center text-lg">
                <List className="me-2" /> Permissões
              </span>
              <Button
                disabled={!modalEditing || isPending}
                size={"sm"}
                onClick={() => setModalPermissaoOpen(true)}
              >
                <Plus size={18} className="me-2" /> Adicionar Permissão
              </Button>
            </div>
            <div className="flex w-full items-end gap-3 ">
              <Table divClassname="bg-background rounded-md">
                <TableHeader className="bg-secondary">
                  <TableRow>
                    <TableHead className="text-white">Ação</TableHead>
                    <TableHead className="text-white">Módulo</TableHead>
                    <TableHead className="text-white">Permissão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissoes.map((permissao, index) => {
                    return (
                      <TableRow key={`${index} - permissao ${permissao.id}`}>
                        <TableCell>
                          <Button
                            size={"xs"}
                            variant={"destructive"}
                            disabled={!modalEditing || isPending}
                            onClick={() => removePermisao(index)}
                          >
                            <Trash size={16} />
                          </Button>
                        </TableCell>

                        <TableCell className="uppercase">{permissao.modulo || "-"}</TableCell>
                        <TableCell className="uppercase">
                          {permissao?.nome.replaceAll("_", " ").replace(":", ": ")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </section>
          <ModalPermissoes
            handleSelection={handleSelectPermissao}
            onOpenChange={() => setModalPermissaoOpen(false)}
            open={modalPermissaoOpen}
            closeOnSelection={false}
          />
        </form>
      </Form>
    </div>
  );
};

export default FormUsers;
