import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import { MantineProvider, Global } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import "./index.css";
import { MyColorSchemeProvider } from "./components/MyColorSchemeProvider.tsx";
import { PrintPDF } from "./PrintPDF.tsx";



const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/print",
    element: <PrintPDF />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MyColorSchemeProvider>
      <RouterProvider router={router} />
    </MyColorSchemeProvider>
  </React.StrictMode>
);
