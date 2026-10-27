import { createFileRoute } from "@tanstack/react-router";
import { PhoneApp } from "@/app/PhoneApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aluvita Studio" },
      {
        name: "description",
        content: "Aluvita Studio — book yoga classes, memberships, and visits from your phone.",
      },
    ],
  }),
  component: PhoneApp,
});
