import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import previewHtml from "./preview-document.html?raw";

function previewResponse() {
  return new Response(previewHtml, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-cache",
    },
  });
}

function isPreviewPath(pathname: string) {
  const path = pathname.split("?")[0]?.replace(/\/+$/, "") || "/";
  return path === "/preview.html";
}

// The app router only knows `/`. A direct visit to `/preview.html` was falling
// through to the not-found page, including on Vercel where the static file
// did not win over the server function.
const previewMiddleware = createMiddleware().server(async ({ next, pathname, request }) => {
  const urlPath = new URL(request.url).pathname;
  if (isPreviewPath(pathname) || isPreviewPath(urlPath)) return previewResponse();
  return next();
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [previewMiddleware, errorMiddleware, csrfMiddleware],
}));
