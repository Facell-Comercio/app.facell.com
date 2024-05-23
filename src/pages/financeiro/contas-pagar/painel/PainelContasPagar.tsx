import { BlocoNotasPendentes } from "./notas-pendentes/BlocoNotasPendentes";
import { BlocoRecorrenciasPendentes } from "./recorrencias-pendentes/BlocoRecorrenciasPendentes";
import { BlocoSolicitacoesNegadas } from "./solicitacoes-negadas/BlocoSolicitacoesNegadas";

export const PainelContasPagar = () => {
    return ( 
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
            <BlocoSolicitacoesNegadas/>
            <BlocoRecorrenciasPendentes/>
            <BlocoNotasPendentes/>
        </div>
     );
}
 