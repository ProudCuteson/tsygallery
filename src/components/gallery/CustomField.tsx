import React from 'react'
import { Control } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { TransformationFormSchema } from './TransformationForm';

type CustomFieldProps = {
  control: Control<z.infer<typeof TransformationFormSchema>> | undefined;
  render: (props: { field: any }) => React.ReactNode;
  name: keyof z.infer<typeof TransformationFormSchema>;
  formLabel?: string;
  className?: string;
};

const CustomField = ({
  control,
  render,
  name,
  formLabel,
  className,
}: CustomFieldProps) => {
  return (
    <FormField 
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>
            {render({ field })}
            <FormMessage />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export default CustomField