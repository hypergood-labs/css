import { theme } from "@hypergood/css";
import { Card } from "~/components/ui/Card";

export default function Home() {
  return (
    <div
      css={{
        w: "100%",
        h: "100vh",
        d: "flex",
        flexDir: "column",
        items: "center",
        justify: "center",
      }}
    >
      <div
        css={{
          h: 400,
          w: 400,
          r: 400 * 0.225,
          background: theme.color.red300,
          color: theme.color.red900,
          d: "flex",
          items: "center",
          justify: "center",
          fontScale: 4,
          "@md": {
            background: theme.color.blue300,
          },
        }}
      ></div>
      <Card>
        <h1 css={{ fontScale: 8, fontWeight: 800 }}>Hypergood CSS</h1>
      </Card>
    </div>
  );
}
