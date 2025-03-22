import { type ButtonHTMLAttributes, type ReactNode, useState } from "react";
import cx from "clsx";
import { toDataAttrs } from "@utils/dataAttrs.ts";
import "./button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  children?: ReactNode;
  disabled?: boolean;
  size?: "small" | "medium";
  color?: "neutral" | "brand";
  variant?: "standard" | "accent" | "subtle";
}

export const Button = ({
  className,
  label,
  children,
  color,
  size = "medium",
  variant = "standard",
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
    disabled,
    hover: !disabled && _hover,
    pressed: !disabled && _pressed,
  });
  return (
    <button
      className={cx("zn:button", className)}
      {...dataAttrs}
      tabIndex={disabled ? -1 : undefined}
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
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        return rest.onClick?.(e);
      }}
    >
      {children ?? label}
    </button>
  );
};
