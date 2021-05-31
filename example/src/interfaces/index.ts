export interface CardProps {
  children?: React.ReactNode;
}

export interface InputProps {
  title?: string;
  description?: string;
  type: string;
  id: string;
  defaultValue?: any;
  valudationSchema?: object;
}
