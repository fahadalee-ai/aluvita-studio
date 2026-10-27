import { createFileRoute } from "@tanstack/react-router";
import previewHtml from "../preview-document.html?raw";

export const Route = createFileRoute("/preview.html")({
  server: {
    handlers: {
      GET: async () =>
        new Response(previewHtml, {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-cache",
          },
        }),
    },
  },
});
