import useSWR from "swr";

import { useAuth } from "@contexts/Authentication";
import CourseDisplay from "@components/course/CourseDisplay";

export default function Courses() {
  const { user } = useAuth();

  const bought = useSWR(`/courses?student=true`);
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

  const boughtCourses: Course[] = bought.data?.courses;
  const producedCourses: Course[] = produced.data?.courses;

  return (
    <div className="py-10">
      <h2 className="font-bold text-2xl mb-6">Cursos adquiridos</h2>
      <div className="grid grid-cols-2 gap-5 screen sm:grid-cols-3 lg:grid-cols-4">
        {boughtCourses.length ? (
          boughtCourses.map((course) => (
            <CourseDisplay key={course.id} course={course} showRate={false} showPrice={false} showWatch={true} />
          ))
        ) : (
          <p>Nenhum curso comprado</p>
        )}
      </div>
      <h2 className="font-bold text-2xl mt-10 mb-6">Meus cursos</h2>
      <div className="grid grid-cols-2 gap-5 screen sm:grid-cols-3 lg:grid-cols-4">
        {producedCourses.length ? (
          producedCourses.map((course) => (
            <CourseDisplay key={course.id} course={course} showRate={false} showPrice={false} showWatch={true} />
          ))
        ) : (
          <p>Nenhum curso produzido</p>
        )}
      </div>
    </div>
  );
}
