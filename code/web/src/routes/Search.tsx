import useSWR from "swr";

import { Skeleton } from "antd";
import { useSearchParams } from "react-router-dom";

import CourseDisplay from "@components/course/CourseDisplay";

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get("q");

  const { data: courses, isLoading } = useSWR<Course[]>(`/courses/search?q=${query}`);

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div className="py-10">
      <h2 className="font-bold text-xl mb-6">Resultados da busca</h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
        {courses?.map((course) => (
          <CourseDisplay key={course.id} course={course} showPrice={true} showRate={true} showWatch={false} />
        ))}
      </div>
    </div>
  );
}
