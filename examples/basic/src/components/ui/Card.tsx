import { css, styled, theme } from "@hypergood/css";

export const cardClasses = css({
  padding: 16,
  backgroundColor: "var(--color-tonal)",
  border: "1px solid var(--color-tonal)",
  boxShadow: "0 0 4px var(--color-tonal)",
});

export const Card = styled("div", {
  position: "relative",
  padding: 16,
  borderRadius: 12,

  variants: {
    variant: {
      tonal: {
        backgroundColor: theme.color.gray50,
      },
      outlined: {
        border: `1px solid ${theme.color.gray300}`,
      },
      elevated: {
        boxShadow: `0 0 4px ${theme.color.gray400}`,
      },
    },
  },

  defaultVariants: {
    variant: "outlined",
  },
});
