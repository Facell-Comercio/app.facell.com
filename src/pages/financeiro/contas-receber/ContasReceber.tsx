import FormTituloPagar from "../contas-pagar/components/titulo/FormTituloPagar";

const ContasReceberPage = () => {
    return (<div className="p-5">
        <h1 className="text-lg font-bold">Contas a receber</h1>

        <FormTituloPagar id_titulo={1} />
    </div>);
}

export default ContasReceberPage;