import {
  Button,
  ButtonGroup,
  type ButtonProps,
  ButtonToggle,
} from "@src/components/Button";
import cx from "clsx";
import React, { type ReactElement, useEffect, useState } from "react";

export default function App() {
  return (
    <div className="relative app-drag flex flex-col justify-center items-center min-h-screen gap-8 p-16">
      <ThemeButton />

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
            {...col}
            {...row}
            className={cx({ "pointer-events-none": key !== 0 })}
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

function ThemeButton() {
  const getIsDark = () =>
    (document.documentElement.getAttribute("data-theme") ?? "light") === "dark";
  const [isDark, setIsDark] = useState(getIsDark);
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
  }, [isDark]);

  return (
    <ButtonToggle
      className="absolute top-4 left-4"
      label={isDark ? "Dark" : "Light"}
      value={isDark}
      onValueChange={setIsDark}
    />
  );
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
