import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePoliticas } from "@/hooks/comercial/usePoliticas";
import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import ButtonCopyPolitica from "./components/ButtonCopyPolitica";
import ButtonNovaPolitica from "./components/ButtonNovaPolitica";
import ButtonNovoCargo from "./components/ButtonNovoCargo";
import ButtonSelectPolitica from "./components/ButtonSelectPolitica";
import ModalCargo from "./components/ModalCargo";
import CargoPolitica, {
  CargoProps,
} from "./modelos/CargoPolitica";
import ModalModeloItem from "./modelos/item/ModalModeloItem";
import ModalModelo from "./modelos/modelo/ModalModelo";
import ModalPoliticas from "./politicas/ModalPoliticas";
import { useStorePoliticas } from "./politicas/store-politicas";

const Politicas = () => {
  const [id_politica, setIdPolitica] =
    useStorePoliticas((state) => [
      state.id,
      state.setIdPolitica,
    ]);
  const { data, isLoading, isSuccess, refetch } =
    usePoliticas().getOne(id_politica);
  useEffect(() => {
    isSuccess && setIdPolitica(data.id);
  }, [isLoading]);

  return (
    <div className="flex flex-col gap-3">
      {/* <div className="flex gap-2 justify-end">
        {checkUserPermission([
          "GERENCIAR_POLITICAS",
          "MASTER",
        ]) && <ButtonImportMeta />}
        {checkUserPermission([
          "GERENCIAR_POLITICAS",
          "MASTER",
        ]) && <ButtonNovaMeta />}
      </div> */}
      <div className="flex gap-2 justify-end flex-wrap">
        {isLoading ? (
          <span className="flex flex-1 justify-end">
            <Skeleton className="w-44 h-10" />
          </span>
        ) : (
          <ButtonSelectPolitica
            refDate={data.refDate}
          />
        )}
        <ButtonCopyPolitica />
        <ButtonNovoCargo />
        <ButtonNovaPolitica />
        <Button onClick={() => refetch()}>
          <RefreshCcw />
        </Button>
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
          return (
            <CargoPolitica
              data={cargo}
              key={`${cargo?.nome} ${cargo?.id}`}
            />
          );
        })
      )}

      <ModalPoliticas />
      <ModalCargo />
      <ModalModelo />
      <ModalModeloItem />
    </div>
  );
};

export default Politicas;
