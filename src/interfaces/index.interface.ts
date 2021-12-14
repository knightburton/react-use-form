import type { Schema, OnSubmit, OnError } from '../types';

export interface IUseForm<FieldTypes> {
  schema: Schema<FieldTypes>;
  onSubmit?: OnSubmit<FieldTypes>;
  onError?: OnError<FieldTypes>;
  resetOnSubmit?: boolean;
  preventDefaultEventOnSubmit?: boolean;
}
