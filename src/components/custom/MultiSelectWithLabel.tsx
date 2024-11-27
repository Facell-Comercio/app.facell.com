import { MultiSelect, MultiSelectProps } from "../ui/multi-select";

interface IMultiSelectWithLabelProps extends MultiSelectProps {
  label: string;
  divClassName?: string;
}

const MultiSelectWithLabel = ({ label, divClassName, ...props }: IMultiSelectWithLabelProps) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${divClassName}`}>
      <label className="text-sm font-medium">{label}</label>
      <MultiSelect {...props} />
    </div>
  );
};

export default MultiSelectWithLabel;
