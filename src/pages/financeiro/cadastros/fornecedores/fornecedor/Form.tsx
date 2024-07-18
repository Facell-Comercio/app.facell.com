import FormInput from '@/components/custom/FormInput';
import FormSwitch from '@/components/custom/FormSwitch';
import SelectFormaPagamento from '@/components/custom/SelectFormaPagamento';
import SelectTipoChavePix from '@/components/custom/SelectTipoChavePix';
import SelectTipoContaBancaria from '@/components/custom/SelectTipoContaBancaria';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import {
  normalizeCepNumber,
  normalizeCnpjNumber,
  normalizePhoneNumber,
} from '@/helpers/mask';
import { useFornecedores } from '@/hooks/financeiro/useFornecedores';
import { api } from '@/lib/axios';
import ModalBancos from '@/pages/financeiro/components/ModalBancos';
import { Contact, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { BancoSchema } from '../../bancos/banco/Modal';
import { FornecedorSchema } from './Modal';
import { useFormFornecedorData } from './form-data';
import { useStoreFornecedor } from './store';

const FormFornecedor = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: FornecedorSchema;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useFornecedores().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useFornecedores().update();
  const [modalEditing, editModal, closeModal, editIsPending, isPending] =
    useStoreFornecedor((state) => [
      state.modalEditing,
      state.editModal,
      state.closeModal,
      state.editIsPending,
      state.isPending,
    ]);
  const [cnpj, setCnpj] = useState<string>();
  const { form } = useFormFornecedorData(data);
  const { errors } = form.formState;
  console.log({ errors });

  const watchFormaPagamento = useWatch({
    control: form.control,
    name: 'id_forma_pagamento',
  });
  const watchTipoChavePix = useWatch({
    control: form.control,
    name: 'id_tipo_chave_pix',
  });

  async function axiosGetCnpjData() {
    try {
      if (!cnpj || cnpj?.length < 14) {
        return;
      }
      const { data: cnpjData } = await api.get(
        `/financeiro/fornecedores/consulta-cnpj/${cnpj}`
      );

      form.setValue('nome', cnpjData.fantasia);
      form.setValue('telefone', cnpjData.telefone);

      form.setValue('razao', cnpjData.nome);
      form.setValue('email', cnpjData.email);
      form.setValue('cep', cnpjData.cep);
      form.setValue('logradouro', cnpjData.logradouro);
      form.setValue('numero', cnpjData.numero);
      form.setValue('bairro', cnpjData.bairro);
      form.setValue('municipio', cnpjData.municipio);
      form.setValue('uf', cnpjData.uf);
      form.setValue('favorecido', cnpjData.fantasia);
      form.setValue('cnpj_favorecido', cnpj || '');
    } catch (error) {
      // @ts-expect-error "Vai funcionar"
      const errorMessage = error.response?.data.message || error.message;
      // console.log(errorMessage);
      toast({
        title: 'Erro na consulta do fornecedor',
        description: errorMessage,
        variant: 'destructive',
        duration: 3500,
      });
    }
  }

  useEffect(() => {
    handleChangeCnpj(data.cnpj, 'cnpj');
    // handleChangePhoneNumber(data.telefone);
    handleChangeCep(data.cep);
    handleChangeCnpj(data.cnpj_favorecido, 'cnpj_favorecido');
  }, []);

  useEffect(() => {
    cnpj && axiosGetCnpjData();
  }, [cnpj]);

  function onBlurCnpj(cnpj: string) {
    const cnpjTratado = cnpj.replace(/\D/g, '');
    if (modalEditing && cnpjTratado.length === 14) {
      setCnpj(cnpjTratado);
    }
  }

  const handleChangeCnpj = (
    value: string,
    type: 'cnpj' | 'cnpj_favorecido'
  ) => {
    form.setValue(type, normalizeCnpjNumber(value));
  };
  // const handleChangePhoneNumber = (value: string) => {
  //   form.setValue("telefone", normalizePhoneNumber(value));
  // };
  const handleChangeCep = (value: string) => {
    form.setValue('cep', normalizeCepNumber(value));
  };

  const onSubmitData = (data: FornecedorSchema) => {
    id && update(data);
    !id && insertOne(data);
  };

  function placeholderChavePix(tipoChavePix: string | number): string {
    if (String(tipoChavePix) === '1') {
      return 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';
    }
    if (String(tipoChavePix) === '2') {
      return 'exemplo@exemplo.com.br';
    }
    if (String(tipoChavePix) === '3') {
      return '(00) 98888-8888';
    }
    if (String(tipoChavePix) === '4') {
      return '111.222.333-44';
    }
    if (String(tipoChavePix) === '5') {
      return '11.222.333/0001-44';
    }
    return '';
  }

  function fnMaskChavePix(tipoChavePix: string | number) {
    if (String(tipoChavePix) === '3') {
      return normalizePhoneNumber;
    }
    if (String(tipoChavePix) === '4' || String(tipoChavePix) === '5') {
      return normalizeCnpjNumber;
    }
    return (tipoChavePix: string | number) => tipoChavePix;
  }

  useEffect(() => {
    if (updateIsSuccess || insertIsSuccess) {
      editModal(false);
      closeModal();
      editIsPending(false);
    } else if (updateIsError || insertIsError) {
      editIsPending(false);
    } else if (updateIsPending || insertIsPending) {
      editIsPending(true);
    }
  }, [updateIsPending, insertIsPending]);

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);
  const [openModalBanco, setOpenModalBanco] = useState<boolean>(false);
  const handleSelectionBanco = (banco: BancoSchema) => {
    form.setValue('id_banco', banco.id);
    form.setValue('banco', banco.nome);
    form.setValue('codigo_banco', banco.codigo);

    setOpenModalBanco(false);
  };

  return (
    <div className="max-w-full overflow-x-hidden">
      <ModalBancos
        handleSelection={handleSelectionBanco}
        open={openModalBanco}
        // @ts-ignore
        onOpenChange={setOpenModalBanco}
      />

      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex gap-2">
                    <Contact />{' '}
                    <span className="text-lg font-bold ">
                      Dados do Fornecedor
                    </span>
                  </div>
                  <FormSwitch
                    name="active"
                    disabled={!modalEditing || isPending}
                    label="Ativo"
                    control={form.control}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <FormInput
                    className="flex-1 min-w-[20ch]"
                    name="cnpj"
                    readOnly={!modalEditing || isPending}
                    label="CPF/CNPJ"
                    control={form.control}
                    onChange={(e) => handleChangeCnpj(e.target.value, 'cnpj')}
                    onBlur={(e) => onBlurCnpj(e.target.value)}
                    fnMask={normalizeCnpjNumber}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch] shrink-0"
                    name="nome"
                    readOnly={!modalEditing || isPending}
                    label="Nome/Nome fantasia"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[15ch]"
                    name="telefone"
                    readOnly={!modalEditing || isPending}
                    label="Telefone"
                    control={form.control}
                    // fnMask={normalizePhoneNumber}
                  />
                  <FormInput
                    className="flex-1 min-w-[30ch]"
                    name="razao"
                    readOnly={!modalEditing || isPending}
                    label="Razão social"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[55ch]"
                    name="email"
                    readOnly={!modalEditing || isPending}
                    label="Email"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[15ch]"
                    name="cep"
                    readOnly={!modalEditing || isPending}
                    label="CEP"
                    onChange={(e) => handleChangeCep(e.target.value)}
                    control={form.control}
                    fnMask={normalizeCepNumber}
                  />
                  <FormInput
                    className="flex-1 min-w-[10ch]"
                    name="numero"
                    readOnly={!modalEditing || isPending}
                    label="Número"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch]"
                    name="logradouro"
                    readOnly={!modalEditing || isPending}
                    label="Logradouro"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[25ch]"
                    name="bairro"
                    readOnly={!modalEditing || isPending}
                    label="Bairro"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[25ch]"
                    name="municipio"
                    readOnly={!modalEditing || isPending}
                    label="Municipio"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 max-w-[8ch]"
                    name="uf"
                    readOnly={!modalEditing || isPending}
                    label="UF"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[20ch]"
                    name="complemento"
                    readOnly={!modalEditing || isPending}
                    label="Complemento"
                    control={form.control}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <DollarSign />{' '}
                  <span className="text-lg font-bold ">Dados Bancários</span>
                </div>
                <div className="flex gap-3 flex-wrap ">
                  <SelectFormaPagamento
                    className="flex-1 min-w-[20ch]"
                    name="id_forma_pagamento"
                    disabled={!modalEditing || isPending}
                    label="Forma de pagamento"
                    control={form.control}
                  />
                  <FormInput
                    className="flex-1 min-w-[20ch]"
                    readOnly={!modalEditing || isPending}
                    name="cnpj_favorecido"
                    label="CPF/CNPJ Favorecido"
                    control={form.control}
                    onChange={(e) =>
                      handleChangeCnpj(e.target.value, 'cnpj_favorecido')
                    }
                    onBlur={(e) => onBlurCnpj(e.target.value)}
                    fnMask={normalizeCnpjNumber}
                  />
                  <FormInput
                    className="flex-1 min-w-[40ch]"
                    readOnly={!modalEditing || isPending}
                    name="favorecido"
                    label="Favorecido"
                    control={form.control}
                  />
                  {(watchFormaPagamento === '4' ||
                    watchFormaPagamento === '5') && (
                    <>
                      <div onClick={() => setOpenModalBanco(true)}>
                        <FormInput
                          className="flex-1 min-w-[10ch]"
                          readOnly={true}
                          name="banco"
                          label="Banco"
                          placeholder="Selecione"
                          control={form.control}
                        />
                      </div>

                      {watchFormaPagamento === '4' && (
                        <>
                          <SelectTipoChavePix
                            className="flex-1 min-w-[20ch]"
                            name="id_tipo_chave_pix"
                            disabled={!modalEditing || isPending}
                            label="Tipo de chave"
                            control={form.control}
                          />
                          <FormInput
                            className="flex-1 min-w-[20ch]"
                            readOnly={!modalEditing || isPending}
                            name="chave_pix"
                            label="Chave PIX"
                            placeholder={placeholderChavePix(watchTipoChavePix)}
                            control={form.control}
                            fnMask={fnMaskChavePix(watchTipoChavePix)}
                          />
                        </>
                      )}

                      <FormInput
                        className="flex-1 min-w-[20ch]"
                        readOnly={!modalEditing || isPending}
                        name="agencia"
                        label="Agência"
                        control={form.control}
                      />
                      <FormInput
                        className="flex-1 min-w-[15ch] max-w-[10ch]"
                        readOnly={!modalEditing || isPending}
                        name="dv_agencia"
                        label="Dígito AG."
                        control={form.control}
                      />

                      <SelectTipoContaBancaria
                        disabled={!modalEditing || isPending}
                        control={form.control}
                        name="id_tipo_conta"
                        label="Tipo de Conta"
                      />

                      <FormInput
                        className="flex-1 min-w-[15ch]"
                        readOnly={!modalEditing || isPending}
                        name="conta"
                        label="Conta"
                        control={form.control}
                      />
                      <FormInput
                        className="flex-1 min-w-[15ch] max-w-[10ch]"
                        readOnly={!modalEditing || isPending}
                        name="dv_conta"
                        label="Digito. CT."
                        control={form.control}
                      />
                    </>
                  )}
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
