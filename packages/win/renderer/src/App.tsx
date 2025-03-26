import {
  Button,
  ButtonGroup,
  type ButtonProps,
  ButtonToggle,
} from "@src/components/Button";
import cx from "clsx";
import React, {
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from "react";

export default function App() {
  const [ctrlProps, renderControlPanel] = useControlPanel();
  return (
    <div className="relative app-drag flex flex-col justify-center items-center min-h-screen gap-8 p-16">
      {renderControlPanel()}

      <ShowcaseTable
        title="Button"
        rows={[
          { label: "Standard", props: { variant: "standard" } },
          { label: "Accent", props: { variant: "accent" } },
          { label: "Subtle", props: { variant: "subtle" } },
        ]}
        columns={[
          { label: "rest", props: {} },
          { label: "hover", props: { "data-hover": true } },
          { label: "pressed", props: { "data-pressed": true } },
          { label: "disabled", props: { disabled: true } },
          { label: "focused", props: { "data-focused": true } },
        ]}
        renderItem={({ key, col, row }) => (
          <Button
            key={key}
            label="label"
            tabIndex={-1}
            className={cx({ "pointer-events-none": key !== 0 })}
            {...ctrlProps}
            {...row}
            {...col}
          />
        )}
      />

      <ShowcaseTable
        title="ButtonGroup"
        rows={[
          { label: "Standard", props: { variant: "standard" } },
          { label: "Accent", props: { variant: "accent" } },
          { label: "Subtle", props: { variant: "subtle" } },
        ]}
        columns={[
          { label: "rest", props: {} },
          { label: "disabled", props: { disabled: true } },
        ]}
        renderItem={({ key, col, row }) => (
          <ButtonGroup
            key={key}
            className={cx({ "pointer-events-none": key !== 0 })}
            {...ctrlProps}
            {...row}
            {...col}
          >
            <Button label="label" tabIndex={-1} />
            <Button label="label" tabIndex={-1} />
            <Button label="label" tabIndex={-1} />
          </ButtonGroup>
        )}
      />
    </div>
  );
}

function useControlPanel(): [Pick<ButtonProps, "size">, () => ReactNode] {
  const getTheme = () =>
    document.documentElement.getAttribute("data-theme") ?? "light";
  const [theme, setTheme] = useState(getTheme);
  const [size, setSize] = useState<ButtonProps["size"]>("medium");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return [
    {
      size,
    },
    () => (
      <ButtonGroup className="absolute! top-4 left-4" size="small">
        <ButtonToggle
          label={theme}
          value={theme === "dark"}
          onValueChange={(val) => setTheme(val ? "dark" : "light")}
        />
        <ButtonToggle
          label={size}
          value={size === "small"}
          onValueChange={(val) => setSize(val ? "small" : "medium")}
        />
      </ButtonGroup>
    ),
  ];
}

function ShowcaseTable({
  title,
  rows,
  columns,
  renderItem,
}: {
  title: string;
  rows: { label: string; props: any }[];
  columns: { label: string; props: any }[];
  renderItem: (ctx: { key: number; col: any; row: any }) => ReactElement;
}) {
  return (
    <div
      className={cx(
        "w-[1152px]",
        "flex flex-col items-center justify-center",
        "ring-[0.5px] light:ring-zn-light-stroke-ctrl-default dark:ring-zn-dark-stroke-ctrl-default",
      )}
    >
      <ShowcaseRow
        children={[
          <span key="title" className={cx("text-xl font-bold")}>
            {title}
          </span>,
          ...columns.map((col, i) => <span key={i}>{col.label}</span>),
        ]}
      />
      {...rows.map((row, i) => (
        <ShowcaseRow key={i}>
          <div>{row.label}</div>
          {columns.map((col, j) =>
            renderItem({ key: j, col: col.props, row: row.props }),
          )}
        </ShowcaseRow>
      ))}
    </div>
  );
}

function ShowcaseRow({ children }) {
  return (
    <div className={cx("flex flex-row justify-center items-center", "w-full")}>
      {React.Children.map(children, (child, i) => (
        <div
          key={i}
          className={cx(
            "h-[120px] w-0 grow",
            "flex justify-center items-center",
            "ring-inset ring-[0.5px] light:ring-zn-light-stroke-ctrl-default dark:ring-zn-dark-stroke-ctrl-default",
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
