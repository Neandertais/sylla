import { Rate } from "antd";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function CourseDisplay({
  course,
  showRate,
  showPrice,
}: {
  course: Course;
  showRate: boolean;
  showPrice: boolean;
}) {
  return (
    <Link to={`/course/${course.id}`} >
      <div className="w-64">
        <div className={clsx(["w-64 h-80 rounded-lg overflow-hidden bg-gradient-to-tr", randomGradient()])}>
          {course?.bannerUrl && <img className="w-full h-full object-cover" src={course.bannerUrl} />}
        </div>
        <div className="px-2 mt-2">
          <h3 className="font-bold uppercase text-base">{course.name}</h3>
          {showRate && (
            <div className="flex items-center mt-1">
              <span className="font-black text-yellow-500 text-xs">4.5</span>
              <Rate className="scale-[.68] -mt-1 -ml-3" disabled allowHalf count={5} value={4.5} />
            </div>
          )}
          {showPrice && (
            <p className="">
              <span className="font-bold text-base mr-4">R$ 99,99</span>
              <span className="line-through">R$ 99,99</span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function randomGradient() {
  const gradients = [
    "from-cyan-400 to-cyan-600",
    "from-blue-500 to-blue-700",
    "from-blue-400 to-cyan-400",
    "from-pink-500 to-rose-600",
    "from-red-400 to-orange-500",
    "from-violet-500 to-purple-700",
    "from-yellow-400 to-orange-400",
  ];

  return gradients[Math.floor(Math.random() * gradients.length)];
}
