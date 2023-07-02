import useSWR from "swr";

import { Button, Form, Input, Modal, Skeleton } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash-es";

import { api } from "@services/api";

export default function VideoSettings() {
  const { id, video } = useParams();
  const { data, isLoading, mutate } = useSWR<Video>(`/videos/${video}`);

  const navigate = useNavigate();

  const handleUpdateDetails = debounce(async (content: any) => {
    const response = (await api.patch(`videos/${video}`, content)) as any;

    mutate(response.video);
  }, 600);

  const handleDeleteVideo = () => {
    Modal.confirm({
      centered: true,
      title: "Confirmação",
      content: "Tem certeza que deseja excluir o vídeo?",
      cancelText: "Cancelar",
      okText: "Sim",
      onOk: async () => {
        await api.delete(`videos/${video}`);
        navigate(`/c/${id}/studio/content`);
      },
    });
  };

  if (isLoading) return <Skeleton />;

  return (
    <div className="flex gap-12 p-3">
      <Form layout="vertical" className="flex-[6]">
        <Form.Item
          label="Título"
          rules={[{ type: "string", max: 100, message: "O título deve ter no máximo 100 caracteres" }]}
        >
          <Input
            className="block"
            defaultValue={data?.name}
            onChange={(e) => handleUpdateDetails({ name: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="Descrição"
          rules={[{ type: "string", max: 5_000, message: "A descrição deve ter no máximo 5.000 caracteres" }]}
        >
          <Input.TextArea
            className="block"
            defaultValue={data?.description}
            onChange={(e) => handleUpdateDetails({ description: e.target.value })}
          />
        </Form.Item>

        <Button danger type="primary" onClick={handleDeleteVideo}>
          Excluir vídeo
        </Button>
      </Form>
      <div className="flex-[2] max-w-[260px]">
        <div className="aspect-video w-full bg-blue-600 rounded-md overflow-hidden">
          {data?.thumbnailUrl && <img className="w-full h-full object-cover" src={data?.thumbnailUrl} alt="" />}
        </div>
        <Link to="" className="block whitespace-nowrap overflow-hidden text-ellipsis">
          uesada w awdiajdwah asidahwda ahdiwa sadwad wa dsad w
        </Link>
      </div>
    </div>
  );
}
