declare module "lucide-react" {
  import { ComponentType } from "react";

  export interface IconProps {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
    className?: string;
  }

  export const ChevronRight: ComponentType<IconProps>;
  export const ChevronLeft: ComponentType<IconProps>;
  export const Users: ComponentType<IconProps>;
  export const Trophy: ComponentType<IconProps>;
  export const Award: ComponentType<IconProps>;
  export const PlusCircle: ComponentType<IconProps>;
  export const Loader: ComponentType<IconProps>;
  export const Search: ComponentType<IconProps>;
  export const Filter: ComponentType<IconProps>;
  export const X: ComponentType<IconProps>;
  export const Zap: ComponentType<IconProps>;
  export const Star: ComponentType<IconProps>;
  export const StarHalf: ComponentType<IconProps>;
  export const Plus: ComponentType<IconProps>;
  export const Mail: ComponentType<IconProps>;
  export const Eye: ComponentType<IconProps>;
  export const EyeOff: ComponentType<IconProps>;
  // Add other icons as needed
  export const Calendar: ComponentType<IconProps>;
}
