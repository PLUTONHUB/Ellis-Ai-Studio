import { createFileRoute } from "@tanstack/react-router";

import { ActivatedWorkspace } from "~/components/client-conversion-flow";

export const Route = createFileRoute("/workspace")({ component: ActivatedWorkspace });
