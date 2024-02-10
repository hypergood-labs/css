export let variantClassNames = (variants: any) => {
  let variantNames = Object.keys(variants);
  return (props: any) => {
    return variantNames
      .map((name) => variants[name][props[name]?.toString() || ""] || "")
      .join(" ");
  };
};
