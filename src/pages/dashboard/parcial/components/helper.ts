import { ParcialData, RowParcial } from "./context";
import { RowTableParcial } from "./table";

export const processarRowsTable = (data: ParcialData) => {

    const estados: RowTableParcial[] = [
        {
            uf: 'RN',
            tipo: 'uf',
            nome: 'RN',
            controle: 0,
            pos: 0,
            upgrade: 0,
            receita: 0,
            residenciais: 0,
            live: 0,
            portab: 0,
            qtdeAparelho: 0,
            aparelho: 0,
            qtdeAcessorio: 0,
            acessorio: 0,
            qtdePitzi: 0,
            pitzi: 0,

            subRows: []
        },
        {
            uf: 'CE',
            tipo: 'uf',
            nome: 'CE',
            controle: 0,
            pos: 0,
            upgrade: 0,
            receita: 0,
            residenciais: 0,
            live: 0,
            portab: 0,
            qtdeAparelho: 0,
            aparelho: 0,
            qtdeAcessorio: 0,
            acessorio: 0,
            qtdePitzi: 0,
            pitzi: 0,

            subRows: []
        },
        {
            uf: 'BA',
            tipo: 'uf',
            nome: 'BA',
            controle: 0,
            pos: 0,
            upgrade: 0,
            receita: 0,
            residenciais: 0,
            live: 0,
            portab: 0,
            qtdeAparelho: 0,
            aparelho: 0,
            qtdeAcessorio: 0,
            acessorio: 0,
            qtdePitzi: 0,
            pitzi: 0,

            subRows: []
        },
    ]

    const rows: RowTableParcial[] = data?.rows?.reduce((acc: RowTableParcial[], curr: RowParcial) => {

        let filial = acc.find(f => f.nome === curr.filial);

        if (!filial) {
            // Se a filial ainda não existe, cria uma nova
            filial = {
                uf: curr.uf,
                tipo: 'filial',
                nome: curr.filial,
                controle: 0,
                pos: 0,
                upgrade: 0,
                receita: 0,
                residenciais: 0,
                live: 0,
                portab: 0,
                qtdeAparelho: 0,
                aparelho: 0,
                qtdeAcessorio: 0,
                acessorio: 0,
                qtdePitzi: 0,
                pitzi: 0,

                subRows: []
            };
            acc.push(filial);
        }

        filial.controle += Number(curr.controle ?? 0);
        filial.pos += Number(curr.pos ?? 0);
        filial.upgrade += Number(curr.upgrade ?? 0);
        filial.receita += Number(curr.receita ?? 0);
        filial.residenciais += Number(curr.residenciais ?? 0);
        filial.live += Number(curr.live ?? 0);
        filial.portab += Number(curr.portab ?? 0);
        filial.qtdeAparelho += Number(curr.qtde_aparelho ?? 0);
        filial.aparelho += Number(curr.aparelho ?? 0);
        filial.qtdeAcessorio += Number(curr.qtde_acessorio ?? 0);
        filial.acessorio += Number(curr.acessorio ?? 0);
        filial.qtdePitzi += Number(curr.qtde_pitzi ?? 0);
        filial.pitzi += Number(curr.pitzi ?? 0);

        let vendedor = filial.subRows.find(v => v.nome === curr.vendedor);

        if (!vendedor) {
            // Se o vendedor ainda não existe, cria um novo
            vendedor = {
                uf: curr.uf,
                tipo: 'vendedor',
                nome: curr.vendedor,
                controle: 0,
                pos: 0,
                upgrade: 0,
                receita: 0,
                residenciais: 0,
                live: 0,
                portab: 0,
                qtdeAparelho: 0,
                aparelho: 0,
                qtdeAcessorio: 0,
                acessorio: 0,
                qtdePitzi: 0,
                pitzi: 0,
                subRows: []
            };
            filial.subRows.push(vendedor);
        }

        vendedor.controle += Number(curr.controle ?? 0);
        vendedor.pos += Number(curr.pos ?? 0);
        vendedor.upgrade += Number(curr.upgrade ?? 0);
        vendedor.receita += Number(curr.receita ?? 0);
        vendedor.residenciais += Number(curr.residenciais ?? 0);
        vendedor.live += Number(curr.live ?? 0);
        vendedor.portab += Number(curr.portab ?? 0);
        vendedor.qtdeAparelho += Number(curr.qtde_aparelho ?? 0);
        vendedor.aparelho += Number(curr.aparelho ?? 0);
        vendedor.qtdeAcessorio += Number(curr.qtde_acessorio ?? 0);
        vendedor.acessorio += Number(curr.acessorio ?? 0);
        vendedor.qtdePitzi += Number(curr.qtde_pitzi ?? 0);
        vendedor.pitzi += Number(curr.pitzi ?? 0);

        return acc;

    }, []) || [];

    // @ts-ignore
    const total: RowTableParcial = {
        tipo: 'total',
        nome: 'TOTAL',
        controle: 0,
        pos: 0,
        upgrade: 0,
        receita: 0,
        residenciais: 0,
        live: 0,
        portab: 0,
        qtdeAparelho: 0,
        aparelho: 0,
        qtdeAcessorio: 0,
        acessorio: 0,
        qtdePitzi: 0,
        pitzi: 0,
    }

    rows.forEach((curr: RowTableParcial) => {
        let uf = estados.find(estado => estado.uf == curr.uf)
        if (uf) {
            uf.controle += curr.controle
            uf.pos += curr.pos
            uf.upgrade += curr.upgrade
            uf.receita += curr.receita
            uf.residenciais += curr.residenciais
            uf.live += curr.live
            uf.portab += curr.portab
            uf.qtdeAparelho += curr.qtdeAparelho
            uf.aparelho += curr.aparelho
            uf.qtdeAcessorio += curr.qtdeAcessorio
            uf.acessorio += curr.acessorio
            uf.qtdePitzi += curr.qtdePitzi
            uf.pitzi += curr.pitzi
        }

        total.controle += curr.controle
        total.pos += curr.pos
        total.upgrade += curr.upgrade
        total.receita += curr.receita
        total.residenciais += curr.residenciais
        total.live += curr.live
        total.portab += curr.portab
        total.qtdeAparelho += curr.qtdeAparelho
        total.aparelho += curr.aparelho
        total.qtdeAcessorio += curr.qtdeAcessorio
        total.acessorio += curr.acessorio
        total.qtdePitzi += curr.qtdePitzi
        total.pitzi += curr.pitzi

    })

    const rowsTable: RowTableParcial[] = [
        ...rows,
        total,
        ...estados
    ]

    return rowsTable
}