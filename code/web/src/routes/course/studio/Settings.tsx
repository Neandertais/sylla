import type { RcFile } from "antd/es/upload";

import { useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import useCourse from "@hooks/useCourse";

import { toBase64 } from "@utils/converts";
import { api } from "@services/api";

import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

export default function Settings() {
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
        await api.delete(`/courses/${course.id}`);

        navigate("/u/courses");
      },
    });
  }

  async function handleSubmit(form: any) {
    try {
      if (courseThumbnail) await api.patch(`/courses/${course.id}`, form);

      if (courseThumbnail?.file) {
        const form = new FormData();
        form.append("banner", courseThumbnail.file);

        await api.patch(`/courses/${course.id}`, form);
      }

      navigate(`/c/${course.id}/studio`);
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
    <div className="flex flex-col">
      <Form
        layout="vertical"
        className="flex flex-col-reverse lg:flex-row lg:gap-16"
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

          <Form.List name="keywords">
            {(fields, { add, remove }) => (
              <div>
                <label className="block pb-2 mt-8">Quais são as palavras chave deste curso?</label>
                {fields.map((field) => (
                  <Form.Item
                    {...field}
                    rules={[
                      {
                        required: true,
                        pattern: /^[a-zA-z]+$/,
                        message: "A palavra chave não pode conter números ou espaços",
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
              <Button onClick={handleShowModal} className="mr-4" danger>
                Excluir
              </Button>
              <Button type="primary" htmlType="submit">
                Salvar Alterações
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
  );
}
