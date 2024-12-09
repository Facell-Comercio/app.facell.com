import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import ComercialConfiguracoesImportacoes from "./importacoes/ComercialConfiguracoesImportacoes";

export type CustomAccordionConfiguracoesProps = {
  itemOpen: string;
  setItemOpen: (itemOpen: string) => void;
};
const ComercialConfiguracoes = () => {
  const [itemOpen, setItemOpen] = useState("");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-3">
          <CardTitle>Configurações</CardTitle>
          <CardDescription>
            Aqui você realiza algumas configurações no comissionamento
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ComercialConfiguracoesImportacoes itemOpen={itemOpen} setItemOpen={setItemOpen} />
      </CardContent>
    </Card>
  );
};

export default ComercialConfiguracoes;
