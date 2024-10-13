import { Button } from "@/components/ui/button";
import { Copy, CopyCheck } from "lucide-react";
import { TituloCRSchemaProps } from "../form-data";
import { useStoreTituloReceber } from "../store";

export const BtnCopiarTituloReceber = ({
  copyData,
}: {
  copyData: Partial<TituloCRSchemaProps>;
}) => {
  const openModal = useStoreTituloReceber((state) => state.openModal);
  const [tituloCopiado, setTituloReceberCopiado] = useStoreTituloReceber((state) => [
    state.tituloCopiado,
    state.setTituloCopiado,
  ]);

  const handleClickCopiar = () => {
    openModal({
      id: "",
      copyData: {
        ...copyData,
        id_status: "",
        data_emissao: "",
        num_doc: "",
        status: "",
        historico: [],
        url_xml_nota: "",
        url_nota_fiscal: "",
        url_nota_debito: "",
        url_recibo: "",
        url_planilha: "",
        url_outros: "",
      },
    });
    setTituloReceberCopiado(true);
    setTimeout(() => {
      setTituloReceberCopiado(false);
    }, 5000);
  };

  return (
    <Button
      onClick={handleClickCopiar}
      type="button"
      size={"sm"}
      variant={tituloCopiado ? "success" : "secondary"}
    >
      {tituloCopiado ? (
        <>
          <CopyCheck size={18} className="me-2" /> <span>Copiado</span>
        </>
      ) : (
        <>
          <Copy size={18} className="me-2" /> <span>Copiar</span>
        </>
      )}
    </Button>
  );
};
