import type { Schema, OnSubmit } from '../types';

export interface IUseForm<FieldTypes> {
  schema?: Schema<FieldTypes>;
  onSubmit?: OnSubmit<FieldTypes>;
  resetOnSubmit?: boolean;
  useEventTargetValueOnChange?: boolean;
  preventDefaultEventOnSubmit?: boolean;
}
