import { Skeleton } from "antd";
import { Navigate, RouteObject, useParams } from "react-router-dom";

import Course from "@routes/course";
import Create from "@routes/course/Create";
import Watch from "@routes/course/watch";

import { settingsTab } from "@routes/course/studio";

import useCourse from "@hooks/useCourse";

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
    path: "/watch/:course",
    element: <WatchRedirect />,
  },
  {
    path: "/watch/:course/:video",
    element: <Watch />,
  },
  ...settingsTab,
];

export default routes;

function WatchRedirect() {
  const params = useParams();

  const { course, isLoading } = useCourse(params.course!);

  if (isLoading) {
    return <Skeleton />;
  }

  return <Navigate to={course.sections[0]?.videos![0]?.id || ""} />;
}
