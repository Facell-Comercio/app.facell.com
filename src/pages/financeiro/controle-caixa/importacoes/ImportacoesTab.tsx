import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
} from "@/components/ui/accordion";
import ImportacaoItem from "./components/ImportacaoItem";
import { ArrowUpDown, CreditCard, HandCoins, History, Landmark, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModalLogImportacaoRelatorios from "./components/ModalLogImportacaoRelatorios";
import { useState } from "react";


const RELATORIOS = [
    'CIELO-VENDAS',
    'PIX-ITAU',
    'PIX-BRADESCO',
    'RECARGA-RVCELLCARD',
    'PITZI-VENDAS',
    'RENOV-TRADEIN',
    'CREDIARIO',
]

const ImportacoesTab = () => {
    const [modalHistoricoOpen, setModalHistoricoOpen] = useState<boolean>(false);

    return (
        <Card>
            <CardHeader>
                <div className="flex flew-row justify-between gap-3">
                    <div className="flex flex-col gap-2">
                        <CardTitle>Importações</CardTitle>
                        <CardDescription>Aqui você importa os relatórios que são necessários para os cruzamentos de informações</CardDescription>
                    </div>
                    <div>

                        <ModalLogImportacaoRelatorios
                            open={modalHistoricoOpen}
                            // @ts-ignore
                            onOpenChange={(val)=>{
                                setModalHistoricoOpen(val)
                            }}
                            relatorios={RELATORIOS}
                        />
                        <Button onClick={()=>setModalHistoricoOpen(true)} className="flex gap-2" variant={'outline'}><History /> Histórico</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" className="flex flex-col gap-2">
                    <ImportacaoItem icon={<CreditCard />} label="Cielo Vendas" uri="/import-cielo-vendas" />
                    <ImportacaoItem icon={<Landmark />} label="PIX Bradesco" uri="/import-pix-bradesco" />
                    <ImportacaoItem icon={<Landmark />} label="PIX Itaú" uri="/import-pix-itau" />
                    <ImportacaoItem icon={<HandCoins />} label="Recarga RV Cellcard" uri="/import-recarga-rvcellcard" />
                    <ImportacaoItem icon={<Shield />} label="Pitzi Vendas" uri="/import-pitzi-vendas" />
                    <ImportacaoItem icon={<ArrowUpDown />} label="Renov Tradein" uri="/import-renov-tradein" />
                    {/* <ImportacaoItem label="Crediario" uri="/import-crediario"/> */}
                </Accordion>
            </CardContent>
        </Card>
    );
}

export default ImportacoesTab;