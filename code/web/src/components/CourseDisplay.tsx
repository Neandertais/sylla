import { Rate } from "antd";

export default function CourseDisplay() {
    return (
        <div className="w-64" >
            <img className="w-64 h-80 rounded-lg" src="https://picsum.photos/256/320" alt="" />
            <div className="px-1">
                <p className="font-bold uppercase text-base">Como vender curso e ficar milionario</p>
                <div className="flex items-center mt-1">
                    <span className="font-black text-yellow-500 text-xs">4.5</span>
                    <Rate className="scale-[.68] -mt-1 -ml-3" disabled allowHalf count={5} value={4.5} />
                </div>
                <p className="">
                    <span className="font-bold text-base mr-4">R$ 99,99</span>
                    <span className="line-through">R$ 99,99</span>
                </p>
            </div>
        </div>
    )
}