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
import { cn } from "@/lib/utils";

type DefaultValueProps = {
  value: string;
  label: string;
};

interface CustomComboboxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hasCustomValue?: boolean;
  readOnly?: boolean;
  placeholder: string;
  defaultValues: DefaultValueProps[];
  className?: string;
}

export function CustomCombobox({
  value,
  onChange,
  disabled,
  readOnly,
  placeholder,
  defaultValues,
  className,
  hasCustomValue,
}: CustomComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = (currentValue: any) => {
    onChange(String(currentValue).toUpperCase());
    setOpen(false);
  };

  const handleCustomValue = () => {
    onChange(inputValue.toUpperCase());
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || readOnly}
          className={`w-[28ch] justify-between ${className}`}
        >
          {value
            ? defaultValues.find((obj: DefaultValueProps) => obj.value === value)?.label || value
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
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
          <CommandList className="scroll-thin max-h-[38vh]">
            <CommandGroup>
              {defaultValues.map((obj) => (
                <CommandItem
                  key={obj.value}
                  value={obj.value}
                  onSelect={() => !readOnly && handleSelect(obj.value)}
                  className={`${
                    !disabled &&
                    "data-[disabled]:pointer-events-auto data-[disabled]:opacity-100 cursor-pointer"
                  }`}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === obj.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {obj.label}
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
            {hasCustomValue && inputValue.length > 0 && (
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
