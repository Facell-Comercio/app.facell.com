import FormFileUpload from "@/components/custom/FormFileUpload";
import FormInput from "@/components/custom/FormInput";
import FormSwitch from "@/components/custom/FormSwitch";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useUsers } from "@/hooks/useUsers";
import { Departamento } from "@/types/departamento-type";
import { Filial } from "@/types/filial-type";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { Permissao } from "@/types/permissao-type";
import { Fingerprint } from "lucide-react";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import ModalCentrosCustos from "../../../financeiro/components/ModalCentrosCustos";
import ModalDepartamentos from "../../components/ModalDepartamentos";
import ModalFiliais from "../../components/ModalFiliais";
import ModalPermissoes from "../../components/ModalPermissoes";
import { UserFormData, useFormUserData } from "./form-data";
import { useStoreUser } from "./store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableUserFiliais } from "./components/TableFiliais";
import { TableUserCentrosCustos } from "./components/TableCentrosCustos";
import { TableUserDepartamentos } from "./components/TableDepartamentos";
import { TableUserPermissoes } from "./components/TablePermissoes";

const FormUsers = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: UserFormData;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const { mutate: insertOne } = useUsers().insertOne();
  const { mutate: update } = useUsers().update();

  const modalEditing = useStoreUser().modalEditing;
  const editModal = useStoreUser().editModal;
  const closeModal = useStoreUser().closeModal;

  const { form } = useFormUserData(data);

  const {
    fields: filiais,
    append: addFilial,
  } = useFieldArray({
    name: "filiais",
    control: form.control,
  });

  const {
    fields: departamentos,
    append: addDepartamento,
  } = useFieldArray({
    name: "departamentos",
    control: form.control,
  });

  const {
    fields: permissoes,
    append: addPermissao,
  } = useFieldArray({
    name: "permissoes",
    control: form.control,
  });

  const {
    fields: centros_custo,
    append: addCentroCusto,
  } = useFieldArray({
    name: "centros_custo",
    control: form.control,
  });

  const onSubmitData = (newData: UserFormData) => {
    if (id) update(newData);
    if (!id) insertOne(newData);

    editModal(false);
    closeModal();
  };

  const [openModalFiliais, setOpenModalFiliais] = useState<boolean>(false);
  const [openModalDepartamentos, setOpenModalDepartamentos] =
    useState<boolean>(false);
  const [openModalCentrosCusto, setOpenModalCentrosCusto] =
    useState<boolean>(false);
  const [openModalPermissoes, setOpenModalPermissoes] =
    useState<boolean>(false);


  const handleSelectFilial = (filial: Filial) => {
    // verifica se o cara já possui
    const indexFilial = filiais?.findIndex((f) => f.id_filial == filial.id);
    if (indexFilial === -1) {
      // setar a filial
      form.setValue("updateFiliais", true);
      // @ts-ignore
      addFilial({
        id: "",
        id_filial: filial.id || "",
        id_user: id || "",
        nome: filial.nome,
        grupo_economico: filial.grupo_economico
      });
    } else {
      toast({
        title: "Não foi possível adicionar!",
        description: "A filial já consta na lista",
      });
    }
  };

  const handleSelectDepartamento = (departamento: Departamento) => {
    // verifica se o cara já possui
    const indexDepartamento = departamentos?.findIndex(
      (f) => f.id_departamento == departamento.id
    );
    if (indexDepartamento === -1) {
      // setar a departamento
      form.setValue("updateDepartamentos", true);
      // @ts-ignore
      addDepartamento({
        id: "",
        id_departamento: departamento.id || "",
        id_user: id || "",
        nome: departamento.nome,
      });
    } else {
      toast({
        title: "Não foi possível adicionar!",
        description: "O departamento já consta na lista",
      });
    }
  };

  const handleSelectCentroCusto = (centro_custo: CentroCustos) => {
    // verifica se o cara já possui
    const indexCentroCusto = centros_custo?.findIndex(
      (f) => f.id_centro_custo == centro_custo.id
    );
    if (indexCentroCusto === -1) {
      // setar a centro_custos
      form.setValue("updateCentrosCusto", true);
      // @ts-ignore
      addCentroCusto({
        id: "",
        id_centro_custo: centro_custo.id || "",
        id_user: id || "",
        nome: centro_custo.nome,
        grupo_economico: centro_custo.grupo_economico
      });
    } else {
      toast({
        title: "Não foi possível adicionar!",
        description: "O centro de custos já consta na lista",
      });
    }
  };

  const handleSelectPermissao = (permissao: Permissao) => {
    // verifica se o cara já possui
    const indexPermissao = permissoes?.findIndex(
      (f) => f.id_permissao == permissao.id
    );
    if (indexPermissao === -1) {
      // setar a permissao
      form.setValue("updatePermissoes", true);
      // @ts-ignore
      addPermissao({
        id: "",
        id_permissao: permissao.id || "",
        id_user: id || "",
        nome: permissao.nome,
      });
    } else {
      toast({
        title: "Não foi possível adicionar!",
        description: "A permissao já consta na lista",
      });
    }
  };

  return (
    <div className="max-w-full ">
      <ModalFiliais
        handleSelection={handleSelectFilial}
        // @ts-expect-error 'Ignore, vai funcionar...'
        onOpenChange={setOpenModalFiliais}
        open={openModalFiliais}
        closeOnSelection={false}
      />

      <ModalDepartamentos
        handleSelection={handleSelectDepartamento}
        // @ts-expect-error 'Ignore, vai funcionar...'
        onOpenChange={setOpenModalDepartamentos}
        open={openModalDepartamentos}
        closeOnSelection={false}
      />

      <ModalCentrosCustos
        handleSelection={handleSelectCentroCusto}
        // @ts-expect-error 'Ignore, vai funcionar...'
        onOpenChange={setOpenModalCentrosCusto}
        open={openModalCentrosCusto}
        closeOnSelection={false}
      />

      <ModalPermissoes
        handleSelection={handleSelectPermissao}
        // @ts-expect-error 'Ignore, vai funcionar...'
        onOpenChange={setOpenModalPermissoes}
        open={openModalPermissoes}
        closeOnSelection={false}
      />

      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <FormInput name="id" type="hidden" control={form.control} />

          <div className="max-w-full flex flex-col lg:flex-row gap-5">

            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex gap-2">
                    <Fingerprint />{" "}
                    <span className="text-lg font-bold ">Dados do usuário</span>
                  </div>
                  <span className="flex gap-4">
                    <FormSwitch
                      name="active"
                      disabled={!modalEditing}
                      label="Ativo"
                      control={form.control}
                    />
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex flex-col justify-end gap-2 overflow-hidden">
                      <FormLabel>Foto</FormLabel>
                      <div className="w-24">
                        <FormFileUpload
                          name="img_url"
                          mediaType="img"
                          control={form.control}
                          disabled={!modalEditing}
                        />
                      </div>
                    </div>

                    <FormInput
                      className="flex-1 min-w-[50ch]"
                      name="nome"
                      readOnly={!modalEditing}
                      label="Nome"
                      control={form.control}
                    />

                    <FormInput
                      className="flex-1 min-w-40"
                      name="email"
                      readOnly={!modalEditing}
                      label="Email"
                      control={form.control}
                    />
                  </div>

                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <h2 className="mb-2 font-bold text-md">
                  Restrições de acesso
                </h2>

                <Tabs defaultValue="filiais" className="w-full">
                  <TabsList className="w-full justify-start" >
                    <TabsTrigger value="filiais">Filiais</TabsTrigger>
                    <TabsTrigger value="departamentos">Departamentos</TabsTrigger>
                    <TabsTrigger value="centros-custo">Centros-custo</TabsTrigger>
                    <TabsTrigger value="permissoes">Permissoes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="filiais">
                    <div>
                      <div className="flex justify-end mb-2">
                        <Button size={'sm'} onClick={() => setOpenModalFiliais(true)}>Adicionar</Button>
                      </div>
                      <TableUserFiliais form={form} modalEditing={modalEditing} />
                    </div>
                  </TabsContent>
                  <TabsContent value="centros-custo">
                    <div>
                      <div className="flex justify-end mb-2">
                        <Button size={'sm'} onClick={() => setOpenModalCentrosCusto(true)}>Adicionar</Button>
                      </div>
                      <TableUserCentrosCustos form={form} modalEditing={modalEditing} />
                    </div>
                  </TabsContent>
                  <TabsContent value="departamentos">
                    <div>
                      <div className="flex justify-end mb-2">
                        <Button size={'sm'} onClick={() => setOpenModalDepartamentos(true)}>Adicionar</Button>
                      </div>
                      <TableUserDepartamentos form={form} modalEditing={modalEditing} />
                    </div>
                  </TabsContent>
                  <TabsContent value="permissoes">
                    <div>
                      <div className="flex justify-end mb-2">
                        <Button size={'sm'} onClick={() => setOpenModalPermissoes(true)}>Adicionar</Button>
                      </div>
                      <TableUserPermissoes form={form} modalEditing={modalEditing} />
                    </div>
                  </TabsContent>
                </Tabs>

              </div>

            </div>

          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormUsers;
