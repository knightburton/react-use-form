import type { ValidationSchema, OnSubmit } from '../types';

export interface UseInputInterface<T> {
  defaultValue?: T;
  valudationSchema?: ValidationSchema<T>;
  onSubmit?: OnSubmit<T>;
  resetOnSubmit?: boolean;
  useEventTargetValueOnChange?: boolean;
  preventDefaultEventOnSubmit?: boolean;
}
