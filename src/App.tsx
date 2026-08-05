import { RouterProvider } from "react-router-dom";

import { AppProviders } from "@/app/AppProviders";
import { router } from "@/app/router";

/**
 * Application root. Wires providers around the router; the shell lives
 * entirely inside the router, so every route renders within the layout.
 */
export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
