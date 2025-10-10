import { type Config as PuckConfigType, type Data as PuckDataType } from "@measured/puck";
import { type ReactNode } from "react";

export type PuckComponentConfig<T = any> = {
  fields?: Record<string, any>;
  defaultProps?: Partial<T>;
  render: (props: T & { key?: string }) => ReactNode;
};

export type PuckConfig = PuckConfigType & {
  components: Record<string, PuckComponentConfig<any>>;
  root: {
    render: (props: { children: ReactNode; width?: string }) => ReactNode;
  };
};

export type PuckDataComponent = {
  type: string;
  props?: Record<string, any>;
  content?: PuckDataComponent[];
  zoneId?: string;
};

export type PuckData = PuckDataType & {
  content: PuckDataComponent[];
  root?: { props?: { width?: string } };
  preheader?: string;
};