import clsx from "clsx";

import { NavLink, Outlet, RouteObject } from "react-router-dom";

import Content from "@routes/course/studio/Content";
import Video from "@routes/course/studio/VideoSettings";
import Preview from "@routes/course/studio/Preview";
import Settings from "@routes/course/studio/Settings";

export const settingsTab: RouteObject[] = [
  {
    path: "/c/:id/studio",
    element: (
      <div>
        <nav className="flex items-center gap-2 my-6 overflow-x-scroll scrollbar-hide">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              clsx([
                "flex items-center h-8 px-5 font-bold border-[0.8px] rounded-full border-zinc-500 bg-zinc-50 transition whitespace-nowrap hover:text-inherit hover:opacity-60",
                isActive && "!bg-primary !border-transparent text-white hover:text-white hover:!opacity-80",
              ])
            }
          >
            Visão Geral
          </NavLink>
          <NavLink
            to="content"
            className={({ isActive }) =>
              clsx([
                "flex items-center h-8 px-5 font-bold border-[0.8px] rounded-full border-zinc-500 bg-zinc-50 transition whitespace-nowrap hover:text-inherit hover:opacity-60",
                isActive && "!bg-primary !border-transparent text-white hover:text-white hover:!opacity-80",
              ])
            }
          >
            Conteúdo
          </NavLink>
          <NavLink
            to="settings"
            className={({ isActive }) =>
              clsx([
                "flex items-center h-8 px-5 font-bold border-[0.8px] rounded-full border-zinc-500 bg-zinc-50 transition whitespace-nowrap hover:text-inherit hover:opacity-60",
                isActive && "!bg-primary !border-transparent text-white hover:text-white hover:!opacity-80",
              ])
            }
          >
            Configuraçôes
          </NavLink>
        </nav>
        <Outlet />
      </div>
    ),
    children: [
      {
        path: "",
        element: <Preview />,
      },
      {
        path: "content",
        element: <Outlet />,
        children: [
          {
            path: "",
            element: <Content />,
          },
          {
            path: ":video",
            element: <Video />,
          },
        ],
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
];
