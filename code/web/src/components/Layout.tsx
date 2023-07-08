import clsx from "clsx";
import { Outlet, useMatch } from "react-router-dom";

import Header from "@components/Header";

export default function Layout() {
  const isWatchPath = useMatch("/watch/:course/:video");

  return (
    <>
      <Header />
      <main className={clsx(["px-8 mx-auto", !isWatchPath && "max-w-6xl", isWatchPath && "max-w-[1440px]"])}>
        <Outlet />
      </main>
    </>
  );
}
