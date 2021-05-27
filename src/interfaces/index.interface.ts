export interface useInputInterface {
  defaultValue?: ValueType;
  valudationSchema?: ValidationSchemaType;
  onSubmit?: CallbackType;
  resetOnSubmit?: boolean;
  useEventTargetValueOnChange?: boolean;
  preventDefaultEventOnSubmit?: boolean;
};
