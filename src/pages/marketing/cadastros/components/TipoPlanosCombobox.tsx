import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCadastros } from "@/hooks/marketing/useCadastros";
import { cn } from "@/lib/utils";

interface TipoPlanosComboboxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  type: "plano_produto_fidelizado" | "plano_produto_nao_fidelizado";
}

export function TipoPlanosCombobox({
  value,
  onChange,
  disabled,
  readOnly,
  className,
  type,
}: TipoPlanosComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const { data } = useCadastros().getAllPlanos();

  if (!data) return null;
  const tipos_planos = data[type] || [];
  const defaultValues = tipos_planos.map((obj: any) => ({
    ...obj,
    label: obj.value,
  }));
  const handleSelect = (currentValue: any) => {
    onChange(currentValue.toUpperCase());
    setOpen(false);
  };

  const handleCustomValue = () => {
    onChange(inputValue.toUpperCase());
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || readOnly}
          className={`w-[28ch] justify-between ${className}`}
        >
          {value
            ? defaultValues
                .find((value: any) => value.value === value)
                ?.label.replaceAll("_", " ")
                .toUpperCase() || value.replaceAll("_", " ").toUpperCase()
            : "Tipos de Plano"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            readOnly={readOnly}
            placeholder="Procurar..."
            value={inputValue}
            onChangeCapture={(e) => {
              //@ts-ignore
              setInputValue(e.target?.value);
            }}
          />
          <CommandEmpty>Nenhum resultado encontrado</CommandEmpty>
          <CommandList className="scroll-thin">
            <CommandGroup>
              {defaultValues.map((value: any) => (
                <CommandItem
                  key={value.value}
                  value={value.value}
                  onSelect={() => !readOnly && handleSelect(value.value)}
                  className={`${
                    !disabled &&
                    "data-[disabled]:pointer-events-auto data-[disabled]:opacity-100 cursor-pointer"
                  }`}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === value.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {value.label.replaceAll("_", " ").toUpperCase()}
                </CommandItem>
              ))}
            </CommandGroup>
            {inputValue.length > 0 && (
              <CommandItem
                key="custom"
                value={inputValue}
                onSelect={handleCustomValue}
                className={`${
                  !disabled &&
                  "data-[disabled]:pointer-events-auto data-[disabled]:opacity-100 cursor-pointer"
                }`}
              >
                <Check
                  className={cn("mr-2 h-4 w-4", value === inputValue ? "opacity-100" : "opacity-0")}
                />
                {String(inputValue).toUpperCase()}
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
