import FormInput from "@/components/custom/FormInput";
import { SelectFilial } from "@/components/custom/SelectFilial";
import { Button } from "@/components/ui/button";
import { Percent, Trash } from "lucide-react";
import { ItemRateioTituloCR } from "../../../store";

type ItemRateioProps = {
  item: ItemRateioTituloCR;
  index: number;
  canEditItensRateio: boolean;
  id_grupo_economico?: string;
  control: any;
  handleChangeItemRateio: () => void;
  handleRemoveItemRateio: (index: number) => void;
};

const ItemRateio = ({
  item,
  index,
  canEditItensRateio,
  id_grupo_economico,
  control,
  handleChangeItemRateio,
  handleRemoveItemRateio,
}: ItemRateioProps) => {
  return (
    <tr key={item.id}>
      <td className="p-1 w-full">
        <SelectFilial
          name={`itens_rateio.${index}.id_filial`}
          id_grupo_economico={id_grupo_economico}
          disabled={!canEditItensRateio}
          control={control}
        />
      </td>
      <td className="p-1 min-w-40">
        <FormInput
          type="number"
          readOnly={!canEditItensRateio}
          name={`itens_rateio.${index}.percentual`}
          control={control}
          inputClass="text-end pe-3"
          icon={Percent}
          step="0.0001"
          min={0.0001}
          max={100}
          onChange={handleChangeItemRateio}
        />
      </td>
      {canEditItensRateio && (
        <td>
          <Button
            type="button"
            variant="destructive"
            className=""
            onClick={() => {
              handleRemoveItemRateio(index);
            }}
          >
            <Trash size={18} />
          </Button>
        </td>
      )}
    </tr>
  );
};

export default ItemRateio;
