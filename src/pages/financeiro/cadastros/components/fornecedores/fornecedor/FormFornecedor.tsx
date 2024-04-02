import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import FormSwitch from "@/components/custom/FormSwitch";
import SelectFormaPagamento from "@/components/custom/SelectFormaPagamento";
import SelectTipoChavePix from "@/components/custom/SelectTipoChavePix";
import { Form } from "@/components/ui/form";
import {
  normalizeCepNumber,
  normalizeCnpjNumber,
  normalizePhoneNumber,
} from "@/helpers/mask";
import { useFornecedores } from "@/hooks/useFornecedores";
import { api } from "@/lib/axios";
import { Contact, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { FornecedorSchema } from "./ModalFornecedor";
import { useFormFornecedorData } from "./form-fornecedor-data";
import { useStoreFornecedor } from "./store-fornecedor";

const FormFornecedor = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: FornecedorSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  console.log("RENDER - Fornecedor:", id);
  const { mutate: insertOne } = useFornecedores().insertOne();
  const { mutate: update } = useFornecedores().update();
  const modalEditing = useStoreFornecedor().modalEditing;
  const editModal = useStoreFornecedor().editModal;
  const closeModal = useStoreFornecedor().closeModal;
  const [cnpj, setCnpj] = useState<string>();
  const { form } = useFormFornecedorData(data);

  const watchFormaPagamento = useWatch({
    control: form.control,
    name: "id_forma_pagamento",
  });

  async function axiosGetCnpjData() {
    try {
      const { data: cnpjData } = await api.get(
        `/financeiro/fornecedores/consulta-cnpj/${cnpj}`
      );
      form.setValue("nome", cnpjData.fantasia);
      form.setValue("telefone", cnpjData.telefone);
      form.setValue("razao", cnpjData.nome);
      form.setValue("email", cnpjData.email);
      form.setValue("cep", cnpjData.cep);
      form.setValue("logradouro", cnpjData.logradouro);
      form.setValue("numero", cnpjData.numero);
      form.setValue("bairro", cnpjData.bairro);
      form.setValue("municipio", cnpjData.municipio);
      form.setValue("uf", cnpjData.uf);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleChangeCnpj(data.cnpj, "cnpj");
    handleChangePhoneNumber(data.telefone);
    handleChangeCep(data.cep);
    handleChangeCnpj(data.cnpj_favorecido, "cnpj_favorecido");
  }, []);

  useEffect(() => {
    cnpj && axiosGetCnpjData();
  }, [cnpj]);

  function onBlurCnpj(cnpj: string) {
    const cnpjTratado = cnpj.replace(/\D/g, "");
    if (modalEditing && cnpjTratado.length === 14) {
      setCnpj(cnpjTratado);
    }
  }

  const handleChangeCnpj = (
    value: string,
    type: "cnpj" | "cnpj_favorecido"
  ) => {
    form.setValue(type, normalizeCnpjNumber(value));
  };
  const handleChangePhoneNumber = (value: string) => {
    form.setValue("telefone", normalizePhoneNumber(value));
  };
  const handleChangeCep = (value: string) => {
    form.setValue("cep", normalizeCepNumber(value));
  };

  const onSubmitData = (data: FornecedorSchema) => {
    console.log(data);

    if (id) update(data);
    if (!id) insertOne(data);

    editModal(false);
    closeModal();
  };

  console.log(form.formState.errors);

  return (
    <div className="max-w-full overflow-x-hidden">
      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex gap-2">
                    <Contact />{" "}
                    <span className="text-lg font-bold ">
                      Dados do Fornecedor
                    </span>
                  </div>
                  <FormSwitch
                    name="active"
                    disabled={!modalEditing}
                    label="Ativo"
                    control={form.control}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <FormInput
                    className="flex-1 min-w-[20ch]"
                    name="cnpj"
                    readOnly={!modalEditing}
                    label="CPF/CNPJ"
                    control={form.control}
                    onChange={(e) => handleChangeCnpj(e.target.value, "cnpj")}
                    onBlur={(e) => onBlurCnpj(e.target.value)}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch] shrink-0"
                    name="nome"
                    readOnly={!modalEditing}
                    label="Nome fantasia"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[15ch]"
                    name="telefone"
                    readOnly={!modalEditing}
                    label="Telefone"
                    onChange={(e) => handleChangePhoneNumber(e.target.value)}
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[30ch]"
                    name="razao"
                    readOnly={!modalEditing}
                    label="Razão social"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[55ch]"
                    name="email"
                    readOnly={!modalEditing}
                    label="Email"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[15ch]"
                    name="cep"
                    readOnly={!modalEditing}
                    label="CEP"
                    onChange={(e) => handleChangeCep(e.target.value)}
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[10ch]"
                    name="numero"
                    readOnly={!modalEditing}
                    label="Número"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[25ch]"
                    name="bairro"
                    readOnly={!modalEditing}
                    label="Bairro"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[25ch]"
                    name="municipio"
                    readOnly={!modalEditing}
                    label="Municipio"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[5ch]"
                    name="uf"
                    readOnly={!modalEditing}
                    label="UF"
                    control={form.control}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <DollarSign />{" "}
                  <span className="text-lg font-bold ">Dados Bancários</span>
                </div>
                <div className="flex gap-3 flex-wrap items-center">
                  <SelectFormaPagamento
                    className="flex-1 min-w-[20ch]"
                    name="id_forma_pagamento"
                    disabled={!modalEditing}
                    label="Forma de pagamento"
                    control={form.control}
                  />

                  {watchFormaPagamento === "4" && (
                    <SelectTipoChavePix
                      className="flex-1 min-w-[20ch]"
                      name="id_tipo_chave_pix"
                      disabled={!modalEditing}
                      label="Tipo de chave"
                      control={form.control}
                    />
                  )}
                  <FormInput
                    className="flex-1 min-w-[20ch]"
                    readOnly={!modalEditing}
                    type={watchFormaPagamento !== "4" ? "hidden" : ""}
                    name="chave_pix"
                    label="Chave PIX"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[20ch]"
                    readOnly={!modalEditing}
                    name="cnpj_favorecido"
                    label="CPF/CNPJ Favorecido"
                    control={form.control}
                    onChange={(e) =>
                      handleChangeCnpj(e.target.value, "cnpj_favorecido")
                    }
                    onBlur={(e) => onBlurCnpj(e.target.value)}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch]"
                    readOnly={!modalEditing}
                    name="favorecido"
                    label="Favorecido"
                    control={form.control}
                  />

                  <FormInput
                    className="flex-1 min-w-[5ch]"
                    readOnly={!modalEditing}
                    name="agencia"
                    label="AG"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[5ch]"
                    readOnly={!modalEditing}
                    name="dv_agencia"
                    label="DvAg"
                    control={form.control}
                  />
                  <FormSelect
                    name="tipo_conta"
                    disabled={!modalEditing}
                    control={form.control}
                    label={"Tipo de conta"}
                    className="flex-1 min-w-[20ch]"
                    options={[
                      { value: "CORRENTE", label: "CORRENTE" },
                      { value: "POUPANÇA", label: "POUPANÇA" },
                    ]}
                  />
                  <FormInput
                    className="flex-1 min-w-[5ch]"
                    readOnly={!modalEditing}
                    name="conta"
                    label="Conta"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[5ch]"
                    readOnly={!modalEditing}
                    name="dv_conta"
                    label="DvCt"
                    control={form.control}
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

export default FormFornecedor;
