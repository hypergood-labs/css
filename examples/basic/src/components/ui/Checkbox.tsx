import { StateLayer } from "./StateLayer";

export function Checkbox() {
  let ref: HTMLDivElement;

  return (
    <div
      ref={ref!}
      css={{
        position: "relative",
        h: 18,
        w: 18,
        borderRadius: 3,
        border: "2px solid black",
      }}
    >
      <StateLayer
        style={{
          top: "-11px",
          left: "-11px",
          bottom: "-11px",
          right: "-11px",
          "border-radius": "50%",
        }}
      />
    </div>
  );
}
