import { createFileRoute } from "@tanstack/react-router";
import { SendaGame } from "@/components/SendaGame";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <SendaGame />;
}
