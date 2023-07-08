import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Input } from "antd";

import { useAuth } from "@contexts/Authentication";

import { TbMoneybag } from "react-icons/tb";
import { AiOutlineSearch } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const searchMenu = useRef<HTMLDetailsElement>(null);

  function handleCloseSearchMenu() {
    if (!searchMenu.current) return;
    searchMenu.current.open = false;
  }

  return (
    <div className="z-50 relative">
      <header className="shadow-md bg-white">
        <div className="flex relative items-center justify-between px-5 py-3 max-w-7xl mx-auto z-10 sm:px-8">
          <Link to="/" className="hover:text-black">
            <h1 className="font-bold font-base text-xl">SYLLA</h1>
          </Link>
          <Input.Search className="absolute left-1/2 -translate-x-1/2 w-2/5 max-w-80 hidden sm:block" />
          <div className="flex items-center gap-3 sm:gap-6">
            <details ref={searchMenu} className="group z-20 sm:hidden">
              <summary className="flex items-center list-none group-open:before:content-[''] group-open:before:fixed group-open:before:bottom-0 group-open:before:right-0 group-open:before:top-0 group-open:before:left-0">
                <AiOutlineSearch size={20} />
              </summary>
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full px-4">
                <Input.Search
                  addonBefore={
                    <div onClick={handleCloseSearchMenu} className="flex items-center">
                      <BiArrowBack />
                    </div>
                  }
                  className="bg-white"
                />
              </div>
            </details>
            {user ? (
              <>
                <p className="flex items-center font-semibold">
                  <TbMoneybag className="mr-2" color="#f59e0b" />
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "BRL",
                  }).format(user.cash).substring(2)}
                </p>
                <details className="group">
                  <summary className="list-none group-open:before:content-[''] group-open:before:fixed group-open:before:bottom-0 group-open:before:right-0 group-open:before:top-0 group-open:before:left-0">
                    <Avatar className="cursor-pointer" src={user?.avatarUrl} />
                  </summary>
                  <div className="flex flex-col gap-2 py-3 absolute bg-white shadow-md border w-44 right-4 top-16 rounded-md">
                    <Link
                      className="mx-2 px-2 py-1 rounded-md hover:bg-gray-100 hover:text-inherit"
                      to={`/u/${user.username}`}
                    >
                      Visualizar Perfil
                    </Link>
                    <Link className="mx-2 px-2 py-1 rounded-md hover:bg-gray-100 hover:text-inherit" to="/u/settings">
                      Editar Perfil
                    </Link>
                    <div className="border border-t-0 w-full" />
                    <Link className="mx-2 px-2 py-1 rounded-md hover:bg-gray-100 hover:text-inherit" to="/u/courses">
                      Meus Cursos
                    </Link>
                    <Link className="mx-2 px-2 py-1 rounded-md hover:bg-gray-100 hover:text-inherit" to="/c/create">
                      Criar Curso
                    </Link>
                    <div className="border border-t-0 w-full" />
                    <span
                      className="mx-2 cursor-pointer px-2 py-1 rounded-md text-red-500 hover:bg-red-100 hover:text-red-500"
                      onClick={() => {
                        signOut();
                        navigate(0);
                      }}
                    >
                      Sair
                    </span>
                  </div>
                </details>
              </>
            ) : (
              <>
                <Link className="font-bold text-gray-800 hover:text-gray-400 hidden sm:block" to="/auth/signup">
                  Cadastrar
                </Link>
                <Link className="font-bold text-gray-800 hover:text-gray-400" to="/auth/signin">
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
