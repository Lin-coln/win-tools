import { type ButtonHTMLAttributes, type ReactNode, useState } from "react";
import cx from "clsx";
import { toDataAttrs } from "@utils/dataAttrs.ts";
import "./button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  size?: "small" | "medium";
  color?: "neutral" | "brand";
  layout?: "default" | "iconOnly";
  variant?: "standard" | "accent" | "subtle";
}

export const Button = ({
  className,
  label,
  children,
  color,
  size = "medium",
  variant = "standard",
  layout = "default",
  disabled = false,
  ...rest
}: ButtonProps) => {
  color ??= variant === "accent" ? "brand" : "neutral";

  const [_hover, setHover] = useState(false);
  const [_pressed, setPressed] = useState(false);
  const dataAttrs = toDataAttrs({
    size,
    color,
    variant,
    layout,
    disabled,
    hover: !disabled && _hover,
    pressed: !disabled && _pressed,
  });
  return (
    <button
      className={cx("zn:button", className)}
      {...dataAttrs}
      tabIndex={disabled ? -1 : undefined}
      disabled={disabled}
      {...rest}
      onMouseEnter={(e) => {
        setHover(true);
        return rest.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        setPressed(false);
        return rest.onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        setPressed(true);
        return rest.onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setPressed(false);
        return rest.onMouseUp?.(e);
      }}
    >
      {children ?? label}
    </button>
  );
};
