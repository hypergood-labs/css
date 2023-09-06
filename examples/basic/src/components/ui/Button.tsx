import { theme } from "@hypergood/css";
import { JSX, onMount } from "solid-js";
import { OldStateLayer, StateLayer } from "./StateLayer";

export function OldButton(props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      css={{
        position: "relative",
        h: 40,
        px: 20,
        background: theme.color.blue100,
        color: theme.color.blue700,
        fontWeight: 500,
        fontSize: 14,
        borderRadius: 9,
      }}
    >
      {props.children}
      <OldStateLayer />
    </button>
  );
}

export function PlainOldButton(
  props: JSX.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      css={{
        position: "relative",
        h: 40,
        px: 20,
        color: theme.color.blue600,
        fontWeight: 500,
        fontSize: 14,
        borderRadius: 9,
      }}
    >
      {props.children}
      <OldStateLayer />
    </button>
  );
}
