import { RouteObject } from "react-router-dom";

import Profile from "@routes/profile";
import Settings from "@routes/profile/Settings";
import Courses from "@routes/profile/Courses";

const routes: RouteObject[] = [
  {
    path: "/u/:username",
    element: <Profile />,
  },
  {
    path: "/u/settings",
    element: <Settings />,
  },
  {
    path: "/u/courses",
    element: <Courses />,
  },
];

export default routes;
