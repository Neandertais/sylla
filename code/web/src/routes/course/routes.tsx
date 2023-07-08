import { RouteObject } from "react-router-dom";

import Course from "@routes/course";
import Create from "@routes/course/Create";
import Watch from "@routes/course/watch";

import { settingsTab } from "@routes/course/studio";

const routes: RouteObject[] = [
  {
    path: "/c/:id",
    element: <Course />,
  },
  {
    path: "/c/create",
    element: <Create />,
  },
  {
    path: "/watch/:course/:video",
    element: <Watch />,
  },
  ...settingsTab,
];

export default routes;
