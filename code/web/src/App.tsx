import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConfigProvider, App as AppAntd } from "antd";
import { SWRConfig } from "swr";

import Layout from "@components/Layout";
import AuthProvider from "@contexts/Authentication";
import { fetch } from "@services/api";

import Home from "@routes/Home";
import AuthRoutes from "@routes/auth/routes";
import CourseRoutes from "@routes/course/routes";
import ProfileRoutes from "@routes/profile/routes";
import Search from "@routes/Search";
import NotFound from "./404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: "", element: <Home /> },
      { path: "/search", element: <Search /> },
      ...CourseRoutes,
      ...ProfileRoutes,
    ],
  },
  ...AuthRoutes,
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return (
    <ConfigProvider>
      <AppAntd>
        <SWRConfig value={{ fetcher: fetch, provider: () => new Map() }}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </SWRConfig>
      </AppAntd>
    </ConfigProvider>
  );
}
