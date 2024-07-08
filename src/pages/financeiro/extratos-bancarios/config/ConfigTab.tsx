import TarifasPadroes from "./TarifasPadroes/Tarifas";
import TransacoesNaoConciliaveis from "./TransacoesNaoConciliaveis/Transacoes";

const ConfigTab = () => {
  return (
    <>
      <TransacoesNaoConciliaveis />
      <TarifasPadroes />
    </>
  );
};

export default ConfigTab;
