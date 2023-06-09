import useSWR from "swr";

import { useAuth } from "@contexts/Authentication";
import CourseDisplay from "@components/course/CourseDisplay";

export default function Courses() {
  const { user } = useAuth();

  const bought = useSWR(`/courses`);
  const produced = useSWR(`/courses?owner=${user?.username}`);

  if (bought.isLoading || produced.isLoading) {
    return (
      <div className="animate-pulse py-10">
        <div className="bg-gray-200 rounded-sm w-5/12 h-8 mb-2"></div>
        <div className="bg-gray-200 rounded-sm w-10/12 h-12 mb-10"></div>
        <div className="bg-gray-200 rounded-sm w-8/12 h-20"></div>
      </div>
    );
  }

  const boughtCourses: Course[] = bought.data.data;
  const producedCourses: Course[] = produced.data.data;

  return (
    <div className="py-10 max-w-5xl mx-auto">
      <h2 className="font-bold text-2xl mb-6">Cursos adquiridos</h2>
      <div className="flex justify-start flex-wrap gap-12">
        {boughtCourses.length ? (
          boughtCourses.map((course) => (
            <CourseDisplay key={course.id} course={course} showRate={false} showPrice={false} />
          ))
        ) : (
          <p>Nenhum curso comprado</p>
        )}
      </div>
      <h2 className="font-bold text-2xl mt-10 mb-6">Meus cursos</h2>
      <div className="flex justify-start flex-wrap gap-12">
        {producedCourses.length ? (
          producedCourses.map((course) => (
            <CourseDisplay key={course.id} course={course} showRate={false} showPrice={false} />
          ))
        ) : (
          <p>Nenhum curso produzido</p>
        )}
      </div>
    </div>
  );
}
