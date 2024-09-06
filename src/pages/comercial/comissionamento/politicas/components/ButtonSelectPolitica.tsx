import { Button } from "@/components/ui/button";
import { ScrollText } from "lucide-react";
import { useStorePoliticas } from "../politicas/store-politicas";
// import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";

const ButtonSelectPolitica = ({
  refDate,
}: {
  refDate: string;
}) => {
  const openModalPoliticas =
    useStorePoliticas().openModal;
  return (
    <Button
      variant={"outline"}
      className="border-warning"
      onClick={() => openModalPoliticas()}
    >
      <ScrollText className="me-2" size={18} />
      {refDate}
    </Button>
  );
};

export default ButtonSelectPolitica;
