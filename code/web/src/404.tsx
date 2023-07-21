import { BiErrorCircle } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-6">
      <BiErrorCircle  size={48}/>
      <h1 className="font-bold text-4xl">404 - Página não encontrada</h1>
      <Link to={"/"} >Home</Link>
    </div>
  );
}
