import { useRef, useState } from "react";
import { debounce } from "lodash-es";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import clsx from "clsx";

import CourseDisplay from "./CourseDisplay";

export default function CourseList() {
  const container = useRef<HTMLDivElement>(null);

  const [fullLeft, setFullLeft] = useState(true);
  const [fullRight, setFullRight] = useState(false);

  function handleCheckScroll() {
    const fullLeft = container.current?.scrollLeft === 0;
    const fullRight =
      container.current?.scrollWidth! -
        container.current?.scrollLeft! -
        container.current?.clientWidth! <
      1;

    setFullLeft(fullLeft);
    setFullRight(fullRight);
  }

  function handleNavigateToRight() {
    container.current?.scrollTo(container.current.scrollLeft + 288, 0);
  }

  function handleNavigateToLeft() {
    container.current?.scrollTo(container.current.scrollLeft - 288, 0);
  }

  return (
    <section className="mt-10 px-8 mx-auto max-w-7xl">
      <h2 className="font-bold text-2xl">Novidades</h2>
      <div className="relative">
        <div
          className="flex mt-8 gap-8 overflow-x-scroll scrollbar-hide scroll-smooth"
          ref={container}
          onScroll={debounce(handleCheckScroll, 50)}
        >
          <CourseDisplay />
          <CourseDisplay />
          <CourseDisplay />
          <CourseDisplay />
          <CourseDisplay />
          <CourseDisplay />
          <CourseDisplay />
          <CourseDisplay />
        </div>
        <div
          className={clsx([
            "w-10 h-full absolute top-0 right-0 flex items-center justify-center group",
            fullRight && "hidden",
          ])}
        >
          <div className="w-10 h-80 top-0 absolute rounded-l-lg bg-gradient-to-r from-[#00000003] to-[#0000003f]"></div>
          <IoIosArrowForward
            size={32}
            color="#fff"
            onClick={handleNavigateToRight}
            className="hidden group-hover:block z-30 cursor-pointer"
          />
        </div>
        <div
          className={clsx([
            "w-10 h-full absolute top-0 left-0 flex items-center justify-center group",
            fullLeft && "hidden",
          ])}
        >
          <div className="w-10 h-80 top-0 absolute rounded-l-lg bg-gradient-to-l from-[#00000003] to-[#0000003f]"></div>
          <IoIosArrowBack
            size={32}
            color="#fff"
            onClick={handleNavigateToLeft}
            className="hidden group-hover:block z-30 cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
}
