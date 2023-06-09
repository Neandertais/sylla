import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Modal, Rate } from "antd";
import { BsCheckLg, BsPencil } from "react-icons/bs";

import useCourse from "@hooks/useCourse";
import { useAuth } from "@contexts/Authentication";
import { fetch } from "@services/api";

export default function Course() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const { course, isLoading } = useCourse(id!);

  const isOwner = user?.username === course?.owner.username;

  async function handleShowModal() {
    if (!user) {
      navigate(`/auth/signin?redirect=${pathname}`);
    }

    Modal.confirm({
      title: "Deseja realmente comprar o curso?",
      content: "Ao confirmar não será possível devolver o curso",
      okText: "Sim",
      cancelText: "Cancelar",
      type: "confirm",
      onOk: async () => {
        try {
          await fetch.post(`/courses/${course.id}/buy`);

          navigate("/u/courses");
        } catch {
          Modal.error({
            title: "Desculpe houve um erro",
            content: "Verifique se possui dinheiro suficiente, e tente novamente mais tarde",
          });
        }
      },
    });
  }

  if (isLoading) {
    return (
      <div className="animate-pulse py-10">
        <div className="bg-gray-200 rounded-sm w-5/12 h-8 mb-2"></div>
        <div className="bg-gray-200 rounded-sm w-10/12 h-12 mb-10"></div>
        <div className="bg-gray-200 rounded-sm w-8/12 h-20"></div>
      </div>
    );
  }

  return (
    <div className="my-10 max-w-6xl mx-auto">
      <div className="flex gap-10">
        <div className="flex flex-col flex-1 py-4">
          {isOwner && (
            <Link
              to={`/course/${course.id}/settings`}
              className="flex self-start items-center gap-2 mb-3 px-3 py-1 border rounded-md hover:border-blue-200"
            >
              <BsPencil />
              Editar
            </Link>
          )}
          <h1 className="font-black text-2xl">{course.name}</h1>
          <p className="mt-4">{course?.description}</p>
          <div className="font-bold mt-3 flex gap-4">
            <span>20 alunos</span>
            <span>10 avaliações</span>
            <span>Criado por {course.owner?.name || course.owner.username}</span>
          </div>
          <div className="mt-3 flex gap-6 items-center">
            <Rate disabled defaultValue={3} />
            <span>(5 avaliações)</span>
          </div>
          <div className="mt-auto flex gap-12 items-center">
            <p>
              <span className="font-bold text-4xl mr-3">
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: "USD",
                }).format(course.price)}
              </span>
              woqs
            </p>
            {!isOwner && (
              <Button type="primary" onClick={handleShowModal}>
                Comprar
              </Button>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-bl from-blue-600 to-cyan-500 w-64 h-80 rounded-xl overflow-hidden">
          {course.bannerUrl && <img className="w-full h-full object-cover" src={course.bannerUrl} alt="" />}
        </div>
      </div>
      <div className="w-10/12">
        {course?.willLearn && (
          <div className="mt-16">
            <h2 className="font-bold text-lg">O que você vai aprender</h2>
            <div className="mt-4 px-4 grid grid-cols-2 gap-4">
              {course.willLearn.map((value) => (
                <p key={value} className="flex items-center gap-2">
                  <BsCheckLg size={20} />
                  {value}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
