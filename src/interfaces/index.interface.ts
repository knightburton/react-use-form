import type { Schema, ValidationSchema, OnSubmit } from '../types';

export interface IUseForm<T> {
  schema?: Schema<T>;
  validationSchema?: ValidationSchema<T>;
  onSubmit?: OnSubmit<T>;
  resetOnSubmit?: boolean;
  useEventTargetValueOnChange?: boolean;
  preventDefaultEventOnSubmit?: boolean;
}
