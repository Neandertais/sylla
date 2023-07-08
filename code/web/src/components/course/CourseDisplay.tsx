import { Button, Rate } from "antd";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function CourseDisplay({
  course,
  showRate,
  showPrice,
  showWatch,
}: {
  course: Course;
  showRate: boolean;
  showPrice: boolean;
  showWatch: boolean;
}) {
  return (
    <div className="flex flex-col w-full h-full gap-5">
      <Link to={`/c/${course.id}`}>
        <div className={clsx(["w-full aspect-[8/10] rounded-lg overflow-hidden bg-gradient-to-tr", randomGradient()])}>
          {course?.bannerUrl && <img className="w-full h-full object-cover" src={course.bannerUrl} />}
        </div>
      </Link>
      <div className="flex flex-col px-2">
        <h3 className="font-bold uppercase text-base">{course.name}</h3>
        {showRate && (
          <div className="flex items-center mt-1">
            <span className="font-black text-yellow-500 text-xs">4.5</span>
            <Rate className="scale-[.68] -mt-1 -ml-3" disabled allowHalf count={5} value={4.5} />
          </div>
        )}
        {showPrice && (
          <p className="flex items-end">
            <span className="font-bold text-xl mr-4">
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "USD",
              }).format(course.price)}
              {" woqs"}
            </span>
            <span className="line-through text-sm">
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "USD",
              }).format(+course.price + 30)}
            </span>
          </p>
        )}
      </div>
      {showWatch && (
        <Link className="mt-auto" to={`/watch/${course.id}`}>
          <Button className="w-full font-bold" type="primary">
            Assistir
          </Button>
        </Link>
      )}
    </div>
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
