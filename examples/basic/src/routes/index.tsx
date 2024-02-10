import { styled } from "@hypergood/css";
import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <h1
        css={{
          color: "red",
        }}
      >
        Hello world!
      </h1>
      <Something>
        <Counter />
      </Something>
      <p>
        Visit{" "}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
    </main>
  );
}

const Something = styled("div", {
  backgroundColor: "red",
  variants: {
    size: {
      small: {
        fontSize: "12px",
      },
      medium: {
        fontSize: "16px",
      },
      large: {
        fontSize: "20px",
      },
    },
  },
  defaultVariants: {
    size: "large",
  },
});
