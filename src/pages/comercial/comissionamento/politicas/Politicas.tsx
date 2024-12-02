import { Skeleton } from "@/components/ui/skeleton";
import { hasPermission } from "@/helpers/checkAuthorization";
import { usePoliticas } from "@/hooks/comercial/usePoliticas";
import { useEffect } from "react";
import ButtonCopyPolitica from "./components/ButtonCopyPolitica";
import ButtonNovaPolitica from "./components/ButtonNovaPolitica";
import ButtonNovoCargo from "./components/ButtonNovoCargo";
import ButtonSelectPolitica from "./components/ButtonSelectPolitica";
import ModalCargo from "./components/ModalCargo";
import CargoPolitica, { CargoProps } from "./modelos/CargoPolitica";
import ModalModeloItem from "./modelos/item/ModalModeloItem";
import ModalModelo from "./modelos/modelo/ModalModelo";
import ModalPolitica from "./politica/Modal";
import ModalPoliticas from "./politicas/ModalPoliticas";
import { useStorePoliticas } from "./politicas/store-politicas";

const Politicas = () => {
  const [id_politica, setIdPolitica] = useStorePoliticas((state) => [
    state.id,
    state.setIdPolitica,
  ]);
  const { data, isLoading, isSuccess } = usePoliticas().getOne(id_politica);
  useEffect(() => {
    isSuccess && setIdPolitica(data.id);
  }, [isLoading]);

  const disabled = !data;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 justify-end flex-wrap">
        <ButtonSelectPolitica refDate={data?.refDate} isLoading={isLoading} disabled={disabled} />
        {hasPermission(["MASTER", "COMISSOES:POLITICAS_CRIAR"]) && (
          <ButtonCopyPolitica isLoading={isLoading} disabled={disabled} />
        )}
        {hasPermission(["MASTER", "COMISSOES:POLITICAS_CRIAR"]) && (
          <ButtonNovoCargo isLoading={isLoading} disabled={disabled} />
        )}
        {hasPermission(["MASTER", "COMISSOES:POLITICAS_CRIAR"]) && (
          <ButtonNovaPolitica isLoading={isLoading} disabled={disabled} />
        )}
      </div>
      {isLoading ? (
        <div className="w-full min-h-full grid gap-3">
          <Skeleton className="w-full row-span-1 h-12" />
          <Skeleton className="w-full row-span-1 h-12" />
          <Skeleton className="w-full row-span-1 h-12" />
          <Skeleton className="w-full row-span-1 h-12" />
          <Skeleton className="w-full row-span-1 h-12" />
          <Skeleton className="w-full row-span-1 h-12" />
          <Skeleton className="w-full row-span-1 h-12" />
        </div>
      ) : (
        data?.cargos.map((cargo: CargoProps) => {
          return <CargoPolitica data={cargo} key={`${cargo?.nome} ${cargo?.id}`} />;
        })
      )}

      <ModalPoliticas />
      <ModalPolitica />
      <ModalCargo />
      <ModalModelo />
      <ModalModeloItem />
    </div>
  );
};

export default Politicas;
