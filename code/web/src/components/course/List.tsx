import CourseDisplay from "@components/course/CourseDisplay";

export default function CourseList({ keyword, courses }: { keyword: string; courses: Course[] }) {
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
