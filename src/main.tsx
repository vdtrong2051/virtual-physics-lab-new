import {
  StrictMode,
} from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  RouterProvider,
} from "react-router/dom";

import router from "./router";

import "./styles/tokens.css";
import "./index.css";

/*
 * Tailwind utilities chỉ phục vụ các thí nghiệm
 * lớp 11 nguyên bản.
 *
 * File legacy-tailwind.css không import Preflight
 * để tránh reset CSS của frame chính.
 */
import "./styles/legacy-tailwind.css";

/*
 * CSS cho công thức react-katex.
 */
import "katex/dist/katex.min.css";

createRoot(
  document.getElementById(
    "root",
  )!,
).render(
  <StrictMode>
    <RouterProvider
      router={router}
    />
  </StrictMode>,
);