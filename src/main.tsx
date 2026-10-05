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
 * Utility CSS cho 3 thí nghiệm lớp 11.
 * Không có Tailwind Preflight.
 */
import "./styles/legacy-tailwind.css";

/*
 * Responsive riêng cho 3 bài lớp 11.
 */
import "./styles/grade11-responsive.css";

/*
 * Công thức toán.
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