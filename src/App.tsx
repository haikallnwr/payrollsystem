import { RouterProvider } from "react-router";
import { AppProviders } from "./app/providers";
import { router } from "./app/router";
import "./index.css";

function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
