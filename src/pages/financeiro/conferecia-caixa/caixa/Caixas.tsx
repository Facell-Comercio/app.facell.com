// import { useAuthStore } from "@/context/auth-store";

import { useConferenciasCaixa } from "@/hooks/financeiro/useConferenciasCaixa";
import { useLocation } from "react-router-dom";

const Caixas = () => {
  const uri = `/financeiro/conferencia-de-caixa/filiais`;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id_filial = searchParams.get("id") || "";

  const { data, refetch, isLoading } = useConferenciasCaixa().getAll({
    filters: {
      id_filial,
    },
  });
  console.log(data);

  return (
    <section className="flex flex-col p-4 w-full bg-red-500">
      <h1>Caixas</h1>
    </section>
  );
};

export default Caixas;
