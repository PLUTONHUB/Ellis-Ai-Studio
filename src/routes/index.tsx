import { createFileRoute } from "@tanstack/react-router";
import { GrowthHome } from "~/components/growth-site";

export const Route = createFileRoute("/")({ component: Home });
function Home() { return <GrowthHome />; }
