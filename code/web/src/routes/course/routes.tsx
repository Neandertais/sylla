import { RouteObject } from "react-router-dom";

import Course from "@routes/course";
import Create from "@routes/course/Create";

import ShowVideo from "./ShowVideo";
import { settingsTab } from "@routes/course/studio";

const routes: RouteObject[] = [
  {
    path: "course/ShowVideo",
    element: <ShowVideo />,
  },
  {
    path: "/c/:id",
    element: <Course />,
  },
  {
    path: "/c/create",
    element: <Create />,
  },
  ...settingsTab,
];

export default routes;
