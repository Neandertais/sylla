import useSWR from "swr";

import CourseList from "@components/course/List";

export default function Home() {
  const { data, isLoading } = useSWR("/courses");

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 animate-pulse py-10 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-full">
            <div className="bg-gray-200 w-full aspect-[8/10] rounded-md"></div>
            <div className="bg-gray-200 w-full h-7 mt-2 rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  const keywords: string[] = data.keywords;

  return (
    <div className="py-10">
      {keywords.map((keyword) => (
        <CourseList key={keyword} keyword={keyword} />
      ))}
    </div>
  );
}
