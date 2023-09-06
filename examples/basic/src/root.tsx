// @refresh reload
import { Suspense, onMount } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";

export default function Root() {
  onMount(() => {
    const updatePixelRatio = () => {
      const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
      const media = matchMedia(mqString);
      media.addEventListener("change", updatePixelRatio);
      // remove = () => {
      //   media.removeEventListener("change", updatePixelRatio);
      // };

      document.documentElement.style.setProperty(
        "--hairline",
        1 / window.devicePixelRatio + "px"
      );
    };

    updatePixelRatio();
  });

  return (
    <Html
      lang="en"
      style={{
        "--hairline": "1px",
      }}
    >
      <Head>
        <Title>SolidStart - With TailwindCSS</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
