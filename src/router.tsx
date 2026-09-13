import { createBrowserRouter } from "react-router";

import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import ExperimentLayout from "./layouts/ExperimentLayout";
import AdminLayout from "./layouts/AdminLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ExperimentCatalog from "./pages/ExperimentCatalog";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminExperiments from "./pages/AdminExperiments";

import ExperimentRoute from "./experiments/ExperimentRoute";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "experiments",
        element: <ExperimentCatalog />,
      },
    ],
  },

  {
    path: "/app/experiments/:slug",
    element: <ExperimentLayout />,
    children: [
      {
        index: true,
        element: <ExperimentRoute />,
      },
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "experiments",
        element: <AdminExperiments />,
      },
    ],
  },
]);

export default router;