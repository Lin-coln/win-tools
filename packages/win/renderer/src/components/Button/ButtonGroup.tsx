import React, { type HTMLAttributes } from "react";
import { Button, type ButtonProps } from "@src/components/Button/Button.tsx";
import cx from "clsx";
import { toDataAttrs } from "@utils/dataAttrs.ts";
import "./button_group.css";

export interface ButtonGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color" | "disabled">,
    Pick<ButtonProps, "variant" | "color" | "disabled" | "size"> {
  // ...
}

export function ButtonGroup({
  children,
  className,
  color,
  size = "medium",
  variant = "standard",
  disabled = false,
  ...rest
}: ButtonGroupProps) {
  color ??= variant === "accent" ? "brand" : "neutral";
  const dataAttrs = toDataAttrs({
    size,
    color,
    variant,
    disabled,
  });
  return (
    <div className={cx("zn:button-group", className)} {...dataAttrs} {...rest}>
      {React.Children.map(children, (child, i) => {
        const isBtn = React.isValidElement(child) && child.type === Button;
        if (!isBtn) return child;

        const childProps: Partial<ButtonProps> = child.props as any;
        return React.cloneElement<ButtonProps>(child as any, {
          size,
          color,
          variant,
          disabled,
          className: cx(childProps.className, ["zn-stroke-none"]),
          ...childProps,
        });
      })}
    </div>
  );
}
