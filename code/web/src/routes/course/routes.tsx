import { RouteObject } from "react-router-dom";

import Course from "@routes/course";
import Videos from "@routes/course/Videos";
import UploadVideo from "@routes/course/UploadVideo";
import Create from "@routes/course/Create";
import Settings from "@routes/course/Settings";
import SettingsCourse from "@routes/course/SettingsCourse";
import AnyCourse from "./AnyCourse";

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
];

export default routes;
