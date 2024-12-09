import { Form } from "@/components/ui/form"
import { useFormEstoqueFardamentoData } from "./form-data"
import FormInput from "@/components/custom/FormInput";
import { useFardamentos } from "@/hooks/useFardamentos";

const FormEstoque = ()=>{

    useFardamentos().getAll
    const { form } = useFormEstoqueFardamentoData(data);
    
    
    return (
        <div className="max-w-full overflow-x-hidden">
            <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmitData)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">

                <div className="flex flex-wrap gap-3">
                  <FormInput
                    className="flex-1 min-w-[20ch]"
                    name="cnpj"
                    readOnly={!modalEditing || isPending}
                    label="CPF/CNPJ"
                    control={form.control}
                    onChange={(e) => handleChangeCnpj(e.target.value, "cnpj")}
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
                  <DollarSign />{" "}
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
                      handleChangeCnpj(e.target.value, "cnpj_favorecido")
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
                  {(watchFormaPagamento === "4" ||
                    watchFormaPagamento === "5") && (
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

                      {watchFormaPagamento === "4" && (
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
    )
                }