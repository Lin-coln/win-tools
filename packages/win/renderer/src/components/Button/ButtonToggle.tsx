import { Button, type ButtonProps } from "@src/components/Button/Button.tsx";
import { isPromiseLike } from "@utils/isPromiseLike.ts";

export interface ButtonToggleProps extends Omit<ButtonProps, "value"> {
  value: boolean;
  onValueChange: (value: boolean) => unknown;
}

export function ButtonToggle({
  value,
  onValueChange,
  ...rest
}: ButtonToggleProps) {
  return (
    <Button
      {...rest}
      color={value ? "brand" : "neutral"}
      variant={value ? "accent" : "standard"}
      onClick={(e) => {
        const valueChangedResult = onValueChange(!value);
        if (isPromiseLike(valueChangedResult)) {
          return Promise.all([valueChangedResult, rest.onClick?.(e)]);
        } else {
          return rest.onClick?.(e);
        }
      }}
    />
  );
}
