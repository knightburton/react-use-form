import type { Schema, OnSubmit } from '../types';

export interface IUseForm<T> {
  schema?: Schema<T>;
  onSubmit?: OnSubmit<T>;
  resetOnSubmit?: boolean;
  useEventTargetValueOnChange?: boolean;
  preventDefaultEventOnSubmit?: boolean;
}
