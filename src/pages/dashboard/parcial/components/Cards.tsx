import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AtivacaoParcial, ParcialData, VendaParcial } from "./context";
import { normalizeCurrency } from "@/helpers/mask";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type ParcialCardsProps = {
    data: ParcialData
}

const CardProdutoParcial = ({ title, rows }: { title: string, rows: VendaParcial[] }) => {

    const grupo = rows.reduce((grupo, venda) => {
        // @ts-ignore
        if (!grupo[venda.descricao]) {
            // @ts-ignore
            grupo[venda.descricao] = [];
        }
        // @ts-ignore
        grupo[venda.descricao].push(venda);
        return grupo;
    }, {});

    // ordena do maior para menor
    const vendasOrdenadas = Object.entries(grupo).sort(
        // @ts-ignore
        (a, b) => b[1].length - a[1].length
    );

    return <Card>
        <CardContent>
            <CardHeader className="px-0">
                <h3 className="text-lg font-bold">{title}</h3>
            </CardHeader>
            <Table>
                <TableHeader>
                    <TableRow className="text-xs">
                        <TableHead>Descrição</TableHead>
                        <TableHead>Qtde</TableHead>
                        <TableHead>Faturamento</TableHead>
                    </TableRow>
                </TableHeader >
                <TableBody>
                    {vendasOrdenadas
                    // @ts-ignore
                    .map((venda: [string,AtivacaoParcial[]], index: number) => {
                        const qtde = venda[1].reduce((acc, curr) => acc + parseInt(curr.qtde), 0)
                        const valor = venda[1].reduce((acc, curr) => acc + curr.valor, 0)

                        return (<TableRow key={'v' + title + index} className="text-xs">
                            <TableCell className="max-w-96 truncate" >{venda[0]}</TableCell>
                            <TableCell>{qtde}</TableCell>
                            <TableCell>{normalizeCurrency(valor)}</TableCell>
                        </TableRow>)
                    }
                    )}
                </TableBody>
            </Table >
        </CardContent>
    </Card>
}

const CardServicoParcial = ({ title, rows }: { title: string, rows: AtivacaoParcial[] }) => {
    
    const grupo = rows.reduce((grupo, venda) => {
        // @ts-ignore
        if (!grupo[venda.plaOpera]) {
            // @ts-ignore
            grupo[venda.plaOpera] = [];
        }
        // @ts-ignore
        grupo[venda.plaOpera].push(venda);
        return grupo;
    }, {});

    // ordena do maior para menor
    const vendasOrdenadas = Object.entries(grupo).sort(
        // @ts-ignore
        (a, b) => b[1].length - a[1].length
    );


    return <Card>
        <CardContent>
            <CardHeader className="px-0">
                <h3 className="text-lg font-bold">{title}</h3>
            </CardHeader>

            <Table>
                <TableHeader>
                    <TableRow className="text-xs">
                        <TableHead>Descrição</TableHead>
                        <TableHead>Qtde</TableHead>
                    </TableRow>
                </TableHeader >
                <TableBody>
                    {
                    vendasOrdenadas
                    // @ts-ignore
                    .map((venda: [string,AtivacaoParcial[]], index: number) => {
                        const qtde = venda[1].reduce((acc, curr) => acc + parseInt(curr.qtde), 0)
                        return (
                        <TableRow key={'a' + title + index} className="text-xs">
                            <TableCell className="max-w-96 truncate" >{venda[0]}</TableCell>
                            <TableCell>{qtde}</TableCell>
                        </TableRow>)
                    }
                    )}
                </TableBody>
            </Table >
        </CardContent>
    </Card>
}

const ParcialCards = ({ data }: ParcialCardsProps) => {
    console.log('Renderizou Cards');
    
    const aparelhos = data.vendas.filter(
        (item) => item.grupoEstoque === "APARELHO"
    );
    const acessorios = data.vendas.filter(
        (item) => item.grupoEstoque.includes("ACESS")
    );
    const controles = data.ativacoes.filter(
        (item) => item.categoria === "CONTROLE"
    );
    const pos = data.ativacoes.filter(
        (item) => item.categoria === "PÓS PURO"
    );



    return (<div className="flex flex-wrap gap-3">
        <CardProdutoParcial title="Aparelhos" rows={aparelhos} />
        <CardProdutoParcial title="Acessórios" rows={acessorios} />
        <CardServicoParcial title="Controle" rows={controles} />
        <CardServicoParcial title="Pós" rows={pos} />
    </div>);
}

export default ParcialCards;