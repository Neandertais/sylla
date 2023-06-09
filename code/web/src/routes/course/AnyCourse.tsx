import { Button, Rate, Form, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import React from 'react';
import { Collapse } from 'antd';

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

export default function AnyCourse() {
  const onChange = (key) => {
    console.log(key);
  };

  return (
    <section className="mt-10 px-8 mx-auto max-w-7xl">
      <div className="flex">
        <div>
          <h2 className="font-bold text-2xl">Explorando o mundo</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur. Tincidunt rhoncus sed sodales
            sagittis nulla suspendisse et morbi.Morbi aliquet varius volutpat
            placerat commodo eu.
          </p>
        </div>
        <div className="flex-1">
          <Form.Item className="">
            <div className="bg-gradient-to-bl from-blue-600 to-cyan-500 w-64 h-80 rounded-xl"></div>
          </Form.Item>
        </div>
      </div>

      <div className="">
        <div className="flex items-center">
          <Rate className="scale-[.68] " disabled allowHalf count={5} value={4.5} />
          <span className="font-black text-black-500 text-xs">(5 avaliações)</span>
        </div>
        <p className="">
          <span className="font-bold text-base mr-4 mt-10">$ 19,90 Woqs</span>
          <Button type="primary">comprar</Button>
        </p>
        <Button>Avaliar</Button>
      </div>

      <div className="">
        <h4 className="font-bold">O que você vai aprender</h4>
      </div>

      <div className="">
        <h4 className="font-bold">Por dentro do curso</h4>

        <Collapse defaultActiveKey={['1']} onChange={onChange}>
          <Panel header="This is panel header 1" key="1">
            <p>{text}</p>
          </Panel>
          <Panel header="This is panel header 2" key="2">
            <p>{text}</p>
          </Panel>
          <Panel header="This is panel header 3" key="3">
            <p>{text}</p>
          </Panel>
        </Collapse>
      </div>
    </section>
  );
}
