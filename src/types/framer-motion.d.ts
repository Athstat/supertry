declare module "framer-motion" {
  import * as React from "react";

  export interface AnimationProps {
    initial?: any;
    animate?: any;
    exit?: any;
    variants?: any;
    transition?: any;
    whileHover?: any;
    whileTap?: any;
    whileFocus?: any;
    whileDrag?: any;
    whileInView?: any;
    viewport?: any;
    drag?: boolean | "x" | "y";
    dragConstraints?: any;
    dragElastic?: boolean | number;
    dragMomentum?: boolean;
    dragTransition?: any;
    onDragStart?: any;
    onDragEnd?: any;
    onDrag?: any;
    onDragTransitionEnd?: any;
    layout?: boolean | string;
    layoutId?: string;
    layoutDependency?: any;
  }

  export interface MotionProps
    extends AnimationProps,
      React.HTMLAttributes<HTMLElement> {
    key?: React.Key;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }

  export const motion: {
    div: React.ForwardRefExoticComponent<
      MotionProps & React.RefAttributes<HTMLDivElement>
    >;
    span: React.ForwardRefExoticComponent<
      MotionProps & React.RefAttributes<HTMLSpanElement>
    >;
    button: React.ForwardRefExoticComponent<
      MotionProps & React.RefAttributes<HTMLButtonElement>
    >;
    a: React.ForwardRefExoticComponent<
      MotionProps & React.RefAttributes<HTMLAnchorElement>
    >;
    ul: React.ForwardRefExoticComponent<
      MotionProps & React.RefAttributes<HTMLUListElement>
    >;
    li: React.ForwardRefExoticComponent<
      MotionProps & React.RefAttributes<HTMLLIElement>
    >;
    // Add other HTML elements as needed
  };

  export const AnimatePresence: React.FC<{
    children?: React.ReactNode;
    exitBeforeEnter?: boolean;
    initial?: boolean;
    onExitComplete?: () => void;
  }>;

  export function useAnimationControls(): {
    start: (animationDefinition: any) => Promise<any>;
    stop: () => void;
    set: (values: any) => void;
  };
}
