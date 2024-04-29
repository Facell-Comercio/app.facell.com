import FormInput from "@/components/custom/FormInput";
import FormSwitch from "@/components/custom/FormSwitch";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useUsers } from "@/hooks/useUsers";
import { Fingerprint } from "lucide-react";
import { UserFormData, useFormUserData } from "./form-data";
import { useStoreUser } from "./store";
import FormFileUpload from "@/components/custom/FormFileUpload";
import { useFieldArray } from "react-hook-form";
import SectionItems from "@/components/custom/SectionItems";
import ModalCentrosCustos from "../../components/ModalCentrosCustos";
import ModalFiliais from "../../components/ModalFiliais";
import ModalDepartamentos from "../../components/ModalDepartamentos";
import ModalPermissoes from "../../components/ModalPermissoes";
import { useState } from "react";
import { Filial } from "@/types/filial-type";
import { Departamento } from "@/types/departamento-type";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import { Permissao } from "@/types/permissao-type";

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

  const { fields: filiais, append: addFilial, remove: removeFilial } = useFieldArray({
    name: 'filiais',
    control: form.control
  })

  const { fields: departamentos, append: addDepartamento, remove: removeDepartamento } = useFieldArray({
    name: 'departamentos',
    control: form.control
  })

  const { fields: permissoes, append: addPermissao, remove: removePermissao } = useFieldArray({
    name: 'permissoes',
    control: form.control
  })

  const { fields: centros_custo, append: addCentroCusto, remove: removeCentroCusto } = useFieldArray({
    name: 'centros_custo',
    control: form.control
  })

  const onSubmitData = (newData: UserFormData) => {
    if (id) update(newData);
    if (!id) insertOne(newData);

    editModal(false);
    closeModal();
  }

  const [openModalFiliais, setOpenModalFiliais] = useState<boolean>(false)
  const [openModalDepartamentos, setOpenModalDepartamentos] = useState<boolean>(false)
  const [openModalCentrosCusto, setOpenModalCentrosCusto] = useState<boolean>(false)
  const [openModalPermissoes, setOpenModalPermissoes] = useState<boolean>(false)

  const handleClickAddFilial = () => {
    setOpenModalFiliais(true)
  }
  const handleClickAddDepartamento = () => {
    setOpenModalDepartamentos(true)
  }
  const handleClickAddCentroCustos = () => {
    setOpenModalCentrosCusto(true)
  }
  const handleClickAddPermissao = () => {
    setOpenModalPermissoes(true)
  }

  const handleSelectFilial = (filial: Filial) => {
    // verifica se o cara já possui
    const indexFilial = filiais?.findIndex(f => f.id_filial == filial.id)
    if (indexFilial === -1) {
      // setar a filial
      form.setValue('updateFiliais', true)
      // @ts-ignore
      addFilial({ id: '', id_filial: filial.id, id_user: id, nome: filial.nome })
    } else {
      toast({
        title: 'Não foi possível adicionar!',
        description: 'A filial já consta na lista'
      })
    }
  }

  const handleSelectDepartamento = (departamento: Departamento) => {
    // verifica se o cara já possui
    const indexDepartamento = departamentos?.findIndex(f => f.id_departamento == departamento.id)
    if (indexDepartamento === -1) {
      // setar a departamento
      form.setValue('updateDepartamentos', true)
      // @ts-ignore
      addDepartamento({ id: '', id_departamento: departamento.id, id_user: id, nome: departamento.nome })
    } else {
      toast({
        title: 'Não foi possível adicionar!',
        description: 'O departamento já consta na lista'
      })
    }
  }

  const handleSelectCentroCusto = (centro_custo: CentroCustos) => {
    // verifica se o cara já possui
    const indexCentroCusto = centros_custo?.findIndex(f => f.id_centro_custo == centro_custo.id)
    if (indexCentroCusto === -1) {
      // setar a centro_custos
      form.setValue('updateCentrosCusto', true)
      // @ts-ignore
      addCentroCusto({ id: '', id_centro_custo: centro_custo.id, id_user: id, nome: centro_custo.nome })
    } else {
      toast({
        title: 'Não foi possível adicionar!',
        description: 'O centro de custos já consta na lista'
      })
    }
  }

  const handleSelectPermissao = (permissao: Permissao) => {
    // verifica se o cara já possui
    const indexPermissao = permissoes?.findIndex(f => f.id_permissao == permissao.id)
    if (indexPermissao === -1) {
      // setar a permissao
      form.setValue('updatePermissoes', true)
      // @ts-ignore
      addPermissao({ id: '', id_permissao: permissao.id, id_user: id, nome: permissao.nome })
    } else {
      toast({
        title: 'Não foi possível adicionar!',
        description: 'A permissao já consta na lista'
      })
    }
  }

  const handleActiveChangeArray = (chave: keyof UserFormData) => {
    form.setValue(chave, true)
  }

  const filiaisContent = filiais.map((filial, index) => (
    <div key={`filial.${index}`} className="flex justify-between items-center rounded-lg bg-blue-800 p-2">
      <p>{filial.nome}</p>
      <div className="flex items-center gap-3">
        <div onClick={() => handleActiveChangeArray('updateFiliais')}>
          <FormSwitch control={form.control} name={`filiais.${index}.gestor`} label="Gestor" disabled={!modalEditing} />
        </div>
        {modalEditing && <Button type="button" variant={'destructive'} size={'sm'} onClick={() => {
          handleActiveChangeArray('updateFiliais')
          removeFilial(index)
        }}>Excluir</Button>}
      </div>
    </div>
  ))

  const departamentosContent = departamentos.map((departamento, index) => (
    <div key={`departamento.${index}`} className="flex justify-between items-center rounded-lg bg-blue-800 p-2">
      <p>{departamento.nome}</p>
      <div className="flex items-center gap-3">
        <div onClick={() => handleActiveChangeArray('updateDepartamentos')}>
          <FormSwitch control={form.control} name={`departamentos.${index}.gestor`} label="Gestor" disabled={!modalEditing} />
        </div>
        {modalEditing && <Button type="button" variant={'destructive'} size={'sm'} onClick={() => {
          handleActiveChangeArray('updateDepartamentos')
          removeDepartamento(index)
        }}>Excluir</Button>}
      </div>
    </div>
  ))

  const centrosCustoContent = centros_custo.map((centro_custo, index) => (
    <div key={`centro_custo.${index}`} className="flex justify-between items-center rounded-lg bg-blue-800 p-2">
      <p>{centro_custo.nome}</p>
      <div className="flex items-center gap-3">
        <div onClick={() => handleActiveChangeArray('updateCentrosCusto')}>
          <FormSwitch control={form.control} disabled={!modalEditing} name={`centros_custo.${index}.gestor`} label="Gestor" />
        </div>
        {modalEditing && <Button type="button" variant={'destructive'} size={'sm'} onClick={() => {
          handleActiveChangeArray('updateCentrosCusto')
          removeCentroCusto(index)
        }}>Excluir</Button>}
      </div>
    </div>
  ))

  const permissoesContent = permissoes.map((permissao, index) => (
    <div key={`permissao.${index}`} className="flex justify-between items-center rounded-lg bg-blue-800 p-2">
      <p>{permissao.nome}</p>
      {modalEditing && <Button type="button" variant={'destructive'} size={'sm'} onClick={() => {
        handleActiveChangeArray('updatePermissoes')
        removePermissao(index)
      }}>Excluir</Button>}
    </div>
  ))



  return (
    <div className="max-w-full ">
      <ModalFiliais
        handleSelecion={handleSelectFilial}
        // @ts-expect-error 'Ignore, vai funcionar...'
        onOpenChange={setOpenModalFiliais}
        open={openModalFiliais}
        closeOnSelection={false}
        />

      <ModalDepartamentos
        handleSelecion={handleSelectDepartamento}
        // @ts-expect-error 'Ignore, vai funcionar...'
        onOpenChange={setOpenModalDepartamentos}
        open={openModalDepartamentos}
        closeOnSelection={false}
      />

      <ModalCentrosCustos
        handleSelecion={handleSelectCentroCusto}
        // @ts-expect-error 'Ignore, vai funcionar...'
        onOpenChange={setOpenModalCentrosCusto}
        open={openModalCentrosCusto}
        closeOnSelection={false}
        />

      <ModalPermissoes
        handleSelecion={handleSelectPermissao}
        // @ts-expect-error 'Ignore, vai funcionar...'
        onOpenChange={setOpenModalPermissoes}
        open={openModalPermissoes}
        closeOnSelection={false}
      />


      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <FormInput
            name="id"
            type="hidden"
            control={form.control}
          />

          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
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

                  <h2 className="mt-2 font-bold text-md">Restrições de acesso</h2>
                  {/* Filiais de acesso */}
                  <SectionItems
                    title='Filiais de acesso'
                    btnAdd={modalEditing ? <Button type="button" size={'sm'} onClick={(e) => {
                      e.stopPropagation()
                      handleClickAddFilial()
                    }}>Adicionar Filial</Button> : undefined}
                    itemsLength={filiais.length}
                    content={filiaisContent}
                  />

                  {/* Departamentos de acesso */}
                  <SectionItems
                    title='Departamentos de acesso'
                    btnAdd={modalEditing ? <Button type="button" size={'sm'} onClick={(e) => {
                      e.stopPropagation()
                      handleClickAddDepartamento()
                    }}>Adicionar Departamento</Button> : undefined}
                    itemsLength={departamentos.length}
                    content={departamentosContent}
                  />

                  {/* Centros de custo */}
                  <SectionItems
                    title='Centros de custo'
                    btnAdd={modalEditing ? <Button type="button" size={'sm'} onClick={(e) => {
                      e.stopPropagation()
                      handleClickAddCentroCustos()
                    }}>Adicionar Centro Custo</Button> : undefined}
                    itemsLength={centros_custo.length}
                    content={centrosCustoContent}
                  />

                  {/* Permissões especiais */}
                  <SectionItems
                    title='Permissões especiais'
                    btnAdd={modalEditing ? <Button type="button" size={'sm'} onClick={(e) => {
                      e.stopPropagation()
                      handleClickAddPermissao()
                    }}>Adicionar Permissão</Button> : undefined}
                    itemsLength={permissoes.length}
                    content={permissoesContent}
                  />


                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormUsers;
