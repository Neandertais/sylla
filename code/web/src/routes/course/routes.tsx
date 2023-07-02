import { RouteObject, Router, RouterProvider } from "react-router-dom";

import Course from "@routes/course";
import Videos from "@routes/course/Videos";
import UploadVideo from "@routes/course/UploadVideo";
import Create from "@routes/course/Create";
import Settings from "@routes/course/Settings";
import SettingsCourse from "@routes/course/SettingsCourse";
import AnyCourse from "./AnyCourse";
import ShowVideo from "./ShowVideo";
import { settingsTab } from "@routes/course/studio";

const routes: RouteObject[] = [
  {
    path: "/course/create",
    element: <Create />,
  },
  {
    path: "/course/:id",
    element: <Course />,
  },
  {
    path: "/course/:id/settings",
    element: <Settings />,
  },
  {
    path: "/course/:id/settings/videos",
    element: <Videos />,
  },
  {
    path: "/course/:id/settings/upload",
    element: <UploadVideo />,
  },
  {
    path: "course/:id/settings/settingscourse",
    element: <SettingsCourse />,
  },
  {
    path: "course/anycourse",
    element: <AnyCourse />,
  },
  {
    path: "course/ShowVideo",
    element: <ShowVideo />,
  },
  {
    path: "/c/:id",
    element: <Course />,
  },
  ...settingsTab,
];

export default routes;
