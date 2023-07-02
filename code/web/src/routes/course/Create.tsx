import { useState } from "react";
import { Button, Form, Input, InputNumber, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { RcFile } from "antd/es/upload";
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import { toBase64 } from "@utils/converts";
import { api } from "@services/api";

export default function CourseCreate() {
  const navigate = useNavigate();

  const [courseThumbnail, setCourseThumbnail] = useState<{
    file: RcFile;
    base64: string;
  }>();

  async function handleSubmit(form: any) {
    try {
      const response = await api.post("/courses", form) as any;
      const courseId = response.course.id;

      if (courseThumbnail) {
        const form = new FormData();
        form.append("banner", courseThumbnail.file);

        await api.patch(`/courses/${courseId}`, form);
      }

      navigate(`/course/${courseId}`);
    } catch {}
  }

  return (
    <div className="flex flex-col max-w-7xl mx-auto py-4 sm:py-10">
      <h1 className="font-sans font-bold text-2xl sm:ml-16">Criar Curso</h1>

      <Form
        layout="vertical"
        className="flex flex-col-reverse sm:mx-32 lg:flex-row lg:mt-10 lg:gap-16"
        requiredMark={false}
        initialValues={{ price: 10 }}
        onFinish={handleSubmit}
      >
        <div className="flex-[1.5]">
          <Form.Item
            label="Dê um nome para o curso"
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
            label="Adicione uma pequena descrição sobre o curso"
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

          <Form.Item label="Qual vai ser o preço do curso?" name="price">
            <InputNumber min={0} max={100} required />
          </Form.Item>

          <Form.List name="willLearn" initialValue={[""]}>
            {(fields, { add, remove }) => (
              <div>
                <label className="block pb-2">O que as pessoas vão aprender no curso?</label>
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

          <Form.List name="keywords" initialValue={[""]}>
            {(fields, { add, remove }) => (
              <div>
                <label className="block pb-2 mt-8">Quais são as palavras chave deste curso?</label>
                {fields.map((field) => (
                  <Form.Item
                    {...field}
                    rules={[
                      {
                        required: true,
                        min: 8,
                        max: 48,
                        message: "Insira uma palavra que contenha entre 8 e 48 caracteres",
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

          <Form.Item>
            <Button type="primary" htmlType="submit" className="mt-8">
              Criar e adicionar videos
            </Button>
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
