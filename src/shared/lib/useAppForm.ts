import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

interface FormConfig<T> {
  defaultValues: T
  validators?: {
    onBlur?: z.ZodSchema<T>
    onSubmit?: z.ZodSchema<T>
  }
  onSubmit: (data: { value: T }) => Promise<void> | void
}

export function useAppForm<T extends Record<string, any>>(config: FormConfig<T>) {
  const form = useForm({
    defaultValues: config.defaultValues,
    onSubmit: async ({ value }) => {
      await config.onSubmit({ value })
    },
    validators: {
      onChange: config.validators?.onBlur,
      onSubmit: config.validators?.onSubmit,
    },
  })

  return form
} 