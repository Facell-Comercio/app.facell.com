import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomAccordionConfiguracoesProps } from "../ComercialConfiguracoes";
import TimAppTimVendas from "./app_tim_vendas/TimAppTimVendas";
import TimDACC from "./tim_dacc/TimDACC";
import TimEsteiraFull from "./tim_esteira_full/TimEsteiraFull";
import TimGU from "./tim_gu/TimGU";
import TimPortabilidade from "./tim_portabilidade/TimPortabilidade";
import TimQualidade from "./tim_qualidade/TimQualidade";
import TimTrafegoZeroDep from "./tim_trafego_zero_dep/TimTrafegoZeroDep";

const ComercialConfiguracoesImportacoes = ({
  itemOpen,
  setItemOpen,
}: CustomAccordionConfiguracoesProps) => {
  return (
    <Accordion
      type="single"
      value={itemOpen}
      onValueChange={(e) => setItemOpen(e)}
      collapsible
      className="p-2 border dark:border-slate-800 rounded-lg "
    >
      <AccordionItem value="item-1" className=" border-0">
        <AccordionTrigger className={`py-1 hover:no-underline`}>Importações</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 p-0 pt-3">
          <Tabs defaultValue={"tim_gu"} orientation="vertical">
            <div className="flex gap-3 h-full">
              <TabsList className="justify-start h-full flex-col">
                <TabsTrigger className="w-full" value="tim_gu">
                  TIM GU
                </TabsTrigger>
                <TabsTrigger className="w-full" value="tim_qualidade">
                  TIM Qualidade
                </TabsTrigger>
                <TabsTrigger className="w-full" value="tim_trafego_zero">
                  TIM Tráfego Zero
                </TabsTrigger>
                <TabsTrigger className="w-full" value="tim_esteira_full">
                  TIM Esteira Full
                </TabsTrigger>
                <TabsTrigger className="w-full" value="tim_app_tim_vendas">
                  TIM App X Siebel
                </TabsTrigger>
                <TabsTrigger className="w-full" value="tim_portabilidade">
                  TIM Portabilidade
                </TabsTrigger>
                <TabsTrigger className="w-full" value="tim_dacc">
                  TIM DACC
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tim_gu" className="w-full border rounded-md p-3 m-0">
                <TimGU />
              </TabsContent>
              <TabsContent value="tim_qualidade" className="w-full border rounded-md p-3 m-0">
                <TimQualidade />
              </TabsContent>
              <TabsContent value="tim_trafego_zero" className="w-full border rounded-md p-3 m-0">
                <TimTrafegoZeroDep />
              </TabsContent>
              <TabsContent value="tim_esteira_full" className="w-full border rounded-md p-3 m-0">
                <TimEsteiraFull />
              </TabsContent>
              <TabsContent value="tim_app_tim_vendas" className="w-full border rounded-md p-3 m-0">
                <TimAppTimVendas />
              </TabsContent>
              <TabsContent value="tim_portabilidade" className="w-full border rounded-md p-3 m-0">
                <TimPortabilidade />
              </TabsContent>
              <TabsContent value="tim_dacc" className="w-full border rounded-md p-3 m-0">
                <TimDACC />
              </TabsContent>
            </div>
          </Tabs>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ComercialConfiguracoesImportacoes;
