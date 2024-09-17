import { Button } from "@/components/ui/button";
import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import ModalContasBancarias from "@/pages/financeiro/components/ModalContasBancarias";
import ModalTituloPagar from "@/pages/financeiro/contas-pagar/titulos/titulo/Modal";
import { useStoreTitulo } from "@/pages/financeiro/contas-pagar/titulos/titulo/store";
import { ContaBancaria } from "@/pages/financeiro/extratos-bancarios/context";
import { useEffect, useState } from "react";

export default function BtnDespesa({
  dadosCaixa,
  dadosDespesa,
  id_titulo,
}: {
  dadosCaixa: any;
  dadosDespesa: any;
  id_titulo?: string;
}) {
  // State local:
  const [contaBancaria, setContaBancaria] = useState<ContaBancaria | null>(null);
  const [modalContasBancariasOpen, setModalContasBancariasOpen] = useState<boolean>(false);
  const { mutate: lancamentoDespesa } = useConferenciasCaixa().lancamentoDespesa();

  // State do Título
  const [openModalTitulo] = useStoreTitulo((state) => [state.openModal]);

  useEffect(() => {
    if (contaBancaria) {
      openModalTitulo({
        id: "",
        copyData: {
          id_status: "1",
          id_filial: String(dadosCaixa.id_filial),
          filial: dadosCaixa.filial,
          id_matriz: String(dadosCaixa.id_matriz),
          id_grupo_economico: String(dadosCaixa.id_grupo_economico),
          id_tipo_solicitacao: "3", // Sem nota fiscal
          id_forma_pagamento: "3", // Dinheiro
          data_emissao: dadosCaixa.data,
          num_doc: dadosDespesa.documento,
          descricao: dadosDespesa.historico,
          valor: String(dadosDespesa.valor),
          rateio_manual: true,

          vencimentos: [
            {
              data_vencimento: dadosCaixa.data,
              data_prevista: dadosCaixa.data,
              valor: String(dadosDespesa.valor),
              cod_barras: "",
              qr_code: "",
            },
          ],
          itens_rateio: [],
        },
      });
    }
  }, [contaBancaria, modalContasBancariasOpen]);

  useEffect(() => {
    !modalContasBancariasOpen && setContaBancaria(null);
  }, [modalContasBancariasOpen]);

  const handleClick = () => {
    setModalContasBancariasOpen(true);
  };
  const handleSelectionContaBancaria = (newContaBancaria: ContaBancaria) => {
    setContaBancaria(newContaBancaria);
  };
  const handleInsertTitulo = (id_titulo: number) => {
    setModalContasBancariasOpen(false);
    setContaBancaria(null);

    lancamentoDespesa({
      id_titulo,
      id_conta_bancaria: contaBancaria?.id || "",
      id_despesa: dadosDespesa.id,
      data_caixa: String(dadosCaixa.data).split("T")[0],
    });
  };

  return (
    <>
      <ModalContasBancarias
        // @ts-ignore
        handleSelection={handleSelectionContaBancaria}
        open={modalContasBancariasOpen}
        // @ts-ignore
        onOpenChange={setModalContasBancariasOpen}
      />

      <ModalTituloPagar handleInsertTitulo={handleInsertTitulo} />

      {id_titulo ? (
        <Button size={"xs"} variant={"success"} onClick={() => openModalTitulo({ id: id_titulo })}>
          Lançado
        </Button>
      ) : (
        <Button onClick={handleClick} size={"xs"}>
          Lançar
        </Button>
      )}
    </>
  );
}
