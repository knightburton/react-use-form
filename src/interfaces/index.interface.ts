export interface useInputInterface {
  defaultValue?: Value;
  valudationSchema?: ValidationSchema;
  onSubmit?: OnSubmit;
  resetOnSubmit?: boolean;
  useEventTargetValueOnChange?: boolean;
  preventDefaultEventOnSubmit?: boolean;
};
