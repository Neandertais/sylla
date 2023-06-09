import { RouteObject } from "react-router-dom";

import { AuthRedirect } from "@contexts/Authentication";

import SignIn from "@routes/auth/SignIn";
import SignUp from "@routes/auth/SignUp";

const routes: RouteObject[] = [
  {
    path: "/auth/signin",
    element: (
      <AuthRedirect>
        <SignIn />
      </AuthRedirect>
    ),
  },
  {
    path: "/auth/signup",
    element: (
      <AuthRedirect>
        <SignUp />
      </AuthRedirect>
    ),
  },
];

export default routes;
