import React from "react";
import { Button, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import LayoutSideBar from "@components/LayoutSideBar";
import { Content } from "antd/es/layout/layout";

const { TextArea } = Input;

export default function CourseCreate() {
  return (
    <LayoutSideBar>
      <Content>
      <div className="flex flex-col py-10">
      <h1 className="font-sans font-bold text-2xl ml-16">Settings Course</h1>

      <Form
        layout="vertical"
        className="mx-32 mt-10 flex gap-16"
      >
        <div className="flex-1">
          <Form.Item label="Dê um nome para o curso">
            <Input />
          </Form.Item>

          <Form.Item label="Adicione uma pequena descrição sobre o curso">
            <TextArea rows={3}></TextArea>
          </Form.Item>

          <Form.Item label="Adicione uma descrição detalhada sobre o curso">
            <TextArea rows={3}></TextArea>
          </Form.Item>

          <Form.Item label="O que você vai ensinar no curso">
            <TextArea rows={3}></TextArea>
          </Form.Item>

          <Form.Item>
            <Button type="primary" className="mt-8">
              Criar e adicionar videos
            </Button>
          </Form.Item>
        </div>

        <div className="flex-1">
          <Form.Item label="Adicionar uma capa" className="">
            <div className="bg-gradient-to-bl from-blue-600 to-cyan-500 w-64 h-80 rounded-xl"></div>
            <Upload>
              <Button className="mt-8" icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </div>
      </Form>
    </div>
      </Content>
    </LayoutSideBar>
  );
}
