import cx from "clsx";
import React, {
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from "react";

export default function App() {
  // const [ctrl, renderControlPanel] = useControlPanel();
  return (
    <div className="relative app-drag flex flex-col justify-center items-center min-h-screen gap-8 p-16 ">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. At beatae
      dolores iste libero maiores neque nihil quas! Animi culpa eaque explicabo
      facilis laboriosam, libero modi, mollitia omnis porro quasi, rerum.
      {/*{renderControlPanel()}*/}
      {/*<ShowcaseTable*/}
      {/*  title="Button"*/}
      {/*  rows={[*/}
      {/*    { label: "Standard", props: { variant: "standard" } },*/}
      {/*    { label: "Accent", props: { variant: "accent" } },*/}
      {/*    { label: "Subtle", props: { variant: "subtle" } },*/}
      {/*  ]}*/}
      {/*  columns={[*/}
      {/*    { label: "rest", props: {} },*/}
      {/*    { label: "hover", props: { "data-hover": true } },*/}
      {/*    { label: "pressed", props: { "data-pressed": true } },*/}
      {/*    { label: "disabled", props: { disabled: true } },*/}
      {/*    { label: "focused", props: { "data-focused": true } },*/}
      {/*  ]}*/}
      {/*  renderItem={({ key, col, row }) => (*/}
      {/*    <Button*/}
      {/*      key={key}*/}
      {/*      label={ctrl.label}*/}
      {/*      tabIndex={-1}*/}
      {/*      className={cx({ "pointer-events-none": key !== 0 })}*/}
      {/*      size={ctrl.size}*/}
      {/*      layout={ctrl.layout}*/}
      {/*      {...row}*/}
      {/*      {...col}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*/>*/}
      {/*<ShowcaseTable*/}
      {/*  title="ButtonGroup"*/}
      {/*  rows={[*/}
      {/*    { label: "Standard", props: { variant: "standard" } },*/}
      {/*    { label: "Accent", props: { variant: "accent" } },*/}
      {/*    { label: "Subtle", props: { variant: "subtle" } },*/}
      {/*  ]}*/}
      {/*  columns={[*/}
      {/*    { label: "rest", props: {} },*/}
      {/*    { label: "disabled", props: { disabled: true } },*/}
      {/*  ]}*/}
      {/*  renderItem={({ key, col, row }) => (*/}
      {/*    <ButtonGroup*/}
      {/*      key={key}*/}
      {/*      className={cx({ "pointer-events-none": key !== 0 })}*/}
      {/*      size={ctrl.size}*/}
      {/*      {...row}*/}
      {/*      {...col}*/}
      {/*    >*/}
      {/*      <Button label="label" tabIndex={-1} />*/}
      {/*      <Button label="label" tabIndex={-1} />*/}
      {/*      <Button label="label" tabIndex={-1} />*/}
      {/*    </ButtonGroup>*/}
      {/*  )}*/}
      {/*/>*/}
    </div>
  );
}

// function useControlPanel(): [
//   Pick<ButtonProps, "size" | "label" | "layout">,
//   () => ReactNode,
// ] {
//   const getTheme = () =>
//     document.documentElement.getAttribute("data-theme") ?? "light";
//   const [theme, setTheme] = useState(getTheme);
//
//   const [size, sizeButton] = useControlButton<ButtonProps["size"]>([
//     "medium",
//     "small",
//   ]);
//
//   const [label, labelButton] = useControlButton<ReactNode>({
//     label: "label",
//     icon: <ExampleIcon />,
//     icon_label: (
//       <>
//         <ExampleIcon />
//         label
//       </>
//     ),
//   });
//
//   const [layout, layoutButton] = useControlButton<ButtonProps["layout"]>([
//     "iconOnly",
//     "default",
//   ]);
//
//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//   }, [theme]);
//
//   return [
//     {
//       size,
//       label,
//       layout,
//     },
//     () => (
//       <ButtonGroup className="absolute! top-4 left-4" size="small">
//         <ButtonToggle
//           label={theme}
//           value={theme === "dark"}
//           onValueChange={(val) => setTheme(val ? "dark" : "light")}
//         />
//         {sizeButton}
//         {labelButton}
//         {layoutButton}
//       </ButtonGroup>
//     ),
//   ];
// }
//
// function ShowcaseTable({
//   title,
//   rows,
//   columns,
//   renderItem,
// }: {
//   title: string;
//   rows: { label: string; props: any }[];
//   columns: { label: string; props: any }[];
//   renderItem: (ctx: { key: number; col: any; row: any }) => ReactElement;
// }) {
//   return (
//     <div
//       className={cx(
//         "w-[1152px]",
//         "flex flex-col items-center justify-center",
//         "ring-[0.5px] light:ring-zn-light-stroke-ctrl-default dark:ring-zn-dark-stroke-ctrl-default",
//       )}
//     >
//       <ShowcaseRow
//         children={[
//           <span key="title" className={cx("text-xl font-bold")}>
//             {title}
//           </span>,
//           ...columns.map((col, i) => <span key={i}>{col.label}</span>),
//         ]}
//       />
//       {...rows.map((row, i) => (
//         <ShowcaseRow key={i}>
//           <div>{row.label}</div>
//           {columns.map((col, j) =>
//             renderItem({ key: j, col: col.props, row: row.props }),
//           )}
//         </ShowcaseRow>
//       ))}
//     </div>
//   );
// }
//
// function ShowcaseRow({ children }) {
//   return (
//     <div className={cx("flex flex-row justify-center items-center", "w-full")}>
//       {React.Children.map(children, (child, i) => (
//         <div
//           key={i}
//           className={cx(
//             "h-[120px] w-0 grow",
//             "flex justify-center items-center",
//             "ring-inset ring-[0.5px] light:ring-zn-light-stroke-ctrl-default dark:ring-zn-dark-stroke-ctrl-default",
//           )}
//         >
//           {child}
//         </div>
//       ))}
//     </div>
//   );
// }
//
// function useControlButton<T = any, State extends string = string>(
//   mapOrArr: Record<State, T> | T[],
// ): [T, ReactNode] {
//   const states: State[] = Array.isArray(mapOrArr)
//     ? mapOrArr
//     : (Object.keys(mapOrArr) as any);
//   const map: Record<State, T> = Array.isArray(mapOrArr)
//     ? Object.fromEntries(mapOrArr.map((x) => [x, x]))
//     : mapOrArr;
//   const [state, setState] = useState(states[0]);
//   const compute = (state: State): T => map[state];
//   return [
//     compute(state),
//     <Button
//       label={state}
//       onClick={() =>
//         setState(states[(states.indexOf(state) + 1) % states.length])
//       }
//     />,
//   ];
// }

function ExampleIcon() {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 8C0 7.26562 0.09375 6.55729 0.28125 5.875C0.473958 5.19271 0.744792 4.55729 1.09375 3.96875C1.44271 3.375 1.85938 2.83594 2.34375 2.35156C2.83333 1.86198 3.3724 1.44271 3.96094 1.09375C4.55469 0.744792 5.19271 0.476562 5.875 0.289062C6.55729 0.0963542 7.26562 0 8 0C8.73438 0 9.44271 0.0963542 10.125 0.289062C10.8073 0.476562 11.4427 0.744792 12.0312 1.09375C12.625 1.44271 13.1641 1.86198 13.6484 2.35156C14.138 2.83594 14.5573 3.375 14.9062 3.96875C15.2552 4.55729 15.5234 5.19271 15.7109 5.875C15.9036 6.55729 16 7.26562 16 8C16 8.73438 15.9036 9.44271 15.7109 10.125C15.5234 10.8073 15.2552 11.4453 14.9062 12.0391C14.5573 12.6276 14.138 13.1667 13.6484 13.6562C13.1641 14.1406 12.625 14.5573 12.0312 14.9062C11.4427 15.2552 10.8073 15.526 10.125 15.7188C9.44271 15.9062 8.73438 16 8 16C7.26562 16 6.55729 15.9062 5.875 15.7188C5.19271 15.526 4.55469 15.2552 3.96094 14.9062C3.3724 14.5573 2.83333 14.1406 2.34375 13.6562C1.85938 13.1667 1.44271 12.6276 1.09375 12.0391C0.744792 11.4453 0.473958 10.8073 0.28125 10.125C0.09375 9.44271 0 8.73438 0 8ZM15 8C15 7.35938 14.9167 6.74219 14.75 6.14844C14.5833 5.54948 14.3464 4.99219 14.0391 4.47656C13.737 3.95573 13.3724 3.48177 12.9453 3.05469C12.5182 2.6276 12.0443 2.26302 11.5234 1.96094C11.0078 1.65365 10.4505 1.41667 9.85156 1.25C9.25781 1.08333 8.64062 1 8 1C7.35417 1 6.73177 1.08333 6.13281 1.25C5.53906 1.41667 4.98177 1.65365 4.46094 1.96094C3.94531 2.26302 3.47396 2.6276 3.04688 3.05469C2.625 3.47656 2.26042 3.94792 1.95312 4.46875C1.65104 4.98438 1.41667 5.54167 1.25 6.14062C1.08333 6.73438 1 7.35417 1 8C1 8.64583 1.08333 9.26823 1.25 9.86719C1.41667 10.4609 1.65104 11.0182 1.95312 11.5391C2.26042 12.0547 2.625 12.526 3.04688 12.9531C3.47396 13.375 3.94531 13.7396 4.46094 14.0469C4.98177 14.349 5.53906 14.5833 6.13281 14.75C6.73177 14.9167 7.35417 15 8 15C8.64583 15 9.26562 14.9167 9.85938 14.75C10.4583 14.5833 11.0156 14.349 11.5312 14.0469C12.0521 13.7396 12.5234 13.375 12.9453 12.9531C13.3724 12.526 13.737 12.0547 14.0391 11.5391C14.3464 11.0182 14.5833 10.4609 14.75 9.86719C14.9167 9.26823 15 8.64583 15 8Z"
        fill="currentColor"
      />
    </svg>
  );
}
