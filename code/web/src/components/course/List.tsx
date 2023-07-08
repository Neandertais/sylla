import useSWR from "swr";

import CourseDisplay from "@components/course/CourseDisplay";

export default function CourseList({ keyword }: { keyword: string }) {
  const { data, isLoading } = useSWR(`/courses/?keyword=${keyword}`);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 animate-pulse py-10 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((v, i) => (
          <div key={i} className="w-full">
            <div className="bg-gray-200 w-full aspect-[8/10] rounded-md"></div>
            <div className="bg-gray-200 w-full h-7 mt-2 rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  const courses: Course[] = data.courses;

  return (
    <div className="mb-10">
      <h2 className="font-bold text-2xl capitalize mb-6">{keyword}</h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
        {courses.map((course) => (
          <CourseDisplay key={course.id} course={course} showPrice={true} showRate={true} showWatch={false} />
        ))}
      </div>
    </div>
  );
}
