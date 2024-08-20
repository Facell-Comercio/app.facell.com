import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { Control } from "react-hook-form";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface IFormTextarea {
  name: string;
  type?: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  description?: string;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
  fnMask?: (val: string) => void;
  icon?: React.ElementType;
  iconLeft?: boolean;
  textareaClass?: string;
  iconClass?: string;
  title?: string;
}

export interface TextAreaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {}

const FormTextarea = ({
  name,
  type,
  control,
  label,
  placeholder,
  description,
  readOnly,
  disabled,
  className,
  onBlur,
  onChange,
  onClick,
  fnMask,
  textareaClass,
  title,
}: IFormTextarea) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem
            className={`${type === "hidden" && "hidden"} ${className} flex-1`}
          >
            {label && <FormLabel className="text-nowrap">{label}</FormLabel>}
            <div>
              <Textarea
                ref={field.ref}
                name={field.name}
                value={
                  typeof fnMask === "function"
                    ? fnMask(field.value)
                    : field.value || ""
                }
                title={title}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={
                  typeof disabled === "undefined" ? field.disabled : disabled
                }
                onBlur={typeof onBlur == "undefined" ? field.onBlur : onBlur}
                onChange={(event) => {
                  field.onChange(event);
                  if (typeof onChange === "function") {
                    onChange(event);
                  }
                }}
                onClick={(e) => onClick && onClick(e)}
                className={`${textareaClass}`}
              />
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormTextarea;
