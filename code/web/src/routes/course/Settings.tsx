import { useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { RcFile } from "antd/es/upload";
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import useCourse from "@hooks/useCourse";
import { fetch } from "@services/api";
import { toBase64 } from "@utils/converts";
import LayoutSideBar from "@components/LayoutSideBar";

export default function CourseSettings() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { course, isLoading } = useCourse(id!);

  const [courseThumbnail, setCourseThumbnail] = useState<{
    file?: RcFile;
    base64?: string;
  }>({ base64: course?.bannerUrl });

  async function handleShowModal() {
    Modal.confirm({
      title: "Deseja realmente deletar o curso?",
      content: "Ao confirmar não será possível restaurar o curso",
      okText: "Sim",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        await fetch.delete(`/courses/${course.id}`)

        navigate('/u/courses')
      },
    });
  }

  async function handleSubmit(form: any) {
    try {
      if (courseThumbnail) await fetch.patch(`/courses/${course.id}`, form);

      if (courseThumbnail?.file) {
        const form = new FormData();
        form.append("banner", courseThumbnail.file);

        await fetch.patch(`/courses/${course.id}`, form);
      }

      navigate(`/course/${course.id}`);
    } catch {}
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
    <LayoutSideBar>
      <div className="flex flex-col max-w-7xl mx-auto py-4 sm:py-10">
        <h1 className="font-sans font-bold text-2xl sm:ml-16">Editar curso</h1>

        <Form
          layout="vertical"
          className="flex flex-col-reverse sm:mx-32 lg:flex-row lg:mt-10 lg:gap-16"
          requiredMark={false}
          initialValues={course}
          onFinish={handleSubmit}
        >
          <div className="flex-[1.5]">
            <Form.Item
              label="Nome do curso"
              name="name"
              rules={[
                {
                  required: true,
                  type: "string",
                  min: 12,
                  message: "O nome deve ter no mínimo 12 caracteres",
                },
                {
                  type: "string",
                  max: 120,
                  message: "O nome deve ter no máximo 120 caracteres",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Descrição"
              name="description"
              rules={[
                {
                  type: "string",
                  min: 20,
                  message: "A descrição deve ter no mínimo 20 caracteres",
                },
                {
                  type: "string",
                  max: 560,
                  message: "A descrição deve ter no máximo 569 caracteres",
                },
              ]}
            >
              <Input.TextArea rows={3}></Input.TextArea>
            </Form.Item>

            <Form.Item label="Preço" name="price">
              <InputNumber min={0} max={100} required />
            </Form.Item>

            <Form.List name="willLearn">
              {(fields, { add, remove }) => (
                <div>
                  <label className="block pb-2">O que você ensina</label>
                  {fields.map((field) => (
                    <Form.Item
                      {...field}
                      rules={[
                        {
                          required: true,
                          min: 8,
                          max: 48,
                          message: "Insira uma frase que contenha entre 8 e 48 caracteres",
                        },
                      ]}
                    >
                      <Input
                        addonAfter={<DeleteOutlined className="text-red-600" onClick={() => remove(field.name)} />}
                      />
                    </Form.Item>
                  ))}
                  <div
                    className="-mt-5 text-lg float-right p-2 cursor-pointer flex items-center gap-2"
                    onClick={() => add()}
                  >
                    <span className="text-sm">Adicionar</span> <PlusOutlined />
                  </div>
                </div>
              )}
            </Form.List>

            <Form.Item className="mt-20">
              <div className="flex justify-end">
                <Button onClick={handleShowModal} className="mr-4" type="text" danger>
                  Deletar
                </Button>
                <Button type="primary" htmlType="submit">
                  Salvar
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className="flex-1 mt-6">
            <Form.Item label="Adicionar uma capa">
              <Upload
                showUploadList={false}
                beforeUpload={(file: RcFile) => {
                  toBase64(file as File).then((base64) => {
                    setCourseThumbnail({ file, base64 });
                  });

                  return false;
                }}
              >
                <div className="flex gap-4 flex-col sm:flex-row lg:flex-col">
                  <div className="bg-gradient-to-bl from-blue-600 to-cyan-500 w-64 h-80 rounded-xl overflow-hidden">
                    <img className="w-full h-full object-cover" src={courseThumbnail?.base64} alt="" />
                  </div>
                  <Button className="self-start sm:self-end lg:self-start" icon={<UploadOutlined />}>
                    Click to Upload
                  </Button>
                </div>
              </Upload>
            </Form.Item>
          </div>
        </Form>
      </div>
    </LayoutSideBar>
  );
}
