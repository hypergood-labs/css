import { styled } from "@hypergood/css";
import { colors } from "~/theme.styles";

const style = {
  width: "120px",
  height: "120px",
  "border-radius": "27px",
  "background-color": "red",
  color: "white",
  display: "inline-flex",
  "justify-content": "center",
  "align-items": "center",
  "margin-bottom": "60px",
  "margin-right": "60px",
};

export default function Home() {
  return (
    <div>
      <h1>The boxes™️</h1>
      <p>These should all be green 🤞</p>
      <div
        style={style}
        css={{
          backgroundColor: "green !important",
        }}
      >
        simple
      </div>
      <div
        style={style}
        css={{
          backgroundColor: `${colors.green} !important`,
        }}
      >
        via theme
      </div>
      <div
        style={style}
        css={[
          {
            backgroundColor: "green !important",
          },
        ]}
      >
        simple array
      </div>
      <Box
        css={{
          backgroundColor: "green !important",
        }}
      >
        via props
      </Box>
      <Box2
        css={{
          backgroundColor: "green !important",
        }}
      >
        via spread
      </Box2>
      <StyledBox>styled</StyledBox>
      <StyledBox2 color="green">styled + variant</StyledBox2>
    </div>
  );
}

function Box(props: any) {
  return (
    <div
      class={props.class}
      css={{
        width: "120px",
        height: "120px",
        "border-radius": "27px",
        "background-color": "red",
        color: "white",
        display: "inline-flex",
        "justify-content": "center",
        "align-items": "center",
        "margin-bottom": "60px",
        "margin-right": "60px",
      }}
    >
      {props.children}
    </div>
  );
}

function Box2(props: any) {
  return (
    <div
      {...props}
      css={{
        width: "120px",
        height: "120px",
        "border-radius": "27px",
        "background-color": "red",
        color: "white",
        display: "inline-flex",
        "justify-content": "center",
        "align-items": "center",
        "margin-bottom": "60px",
        "margin-right": "60px",
      }}
    />
  );
}

const StyledBox = styled("div", {
  width: "120px",
  height: "120px",
  "border-radius": "27px",
  "background-color": "green",
  color: "white",
  display: "inline-flex",
  "justify-content": "center",
  "align-items": "center",
  "margin-bottom": "60px",
  "margin-right": "60px",
});

const StyledBox2 = styled("div", {
  width: "120px",
  height: "120px",
  "border-radius": "27px",
  "background-color": "red",
  color: "white",
  display: "inline-flex",
  "justify-content": "center",
  "align-items": "center",
  "margin-bottom": "60px",
  "margin-right": "60px",
  variants: {
    color: {
      green: {
        backgroundColor: "green",
      },
    },
  },
});
