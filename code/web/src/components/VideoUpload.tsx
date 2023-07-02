import useSWR from "swr";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Form, Input, Modal, Progress, Result, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { debounce } from "lodash-es";

import { AiOutlineCheckCircle } from "react-icons/ai";
import { BiErrorCircle, BiLoaderAlt } from "react-icons/bi";
import { BsCloudCheck } from "react-icons/bs";
import { FiUploadCloud } from "react-icons/fi";

import { api } from "@services/api";

export default function VideoUpload({
  isOpen,
  setIsOpen,
  section,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  section: string;
}) {
  const [state, setState] = useState<"upload" | "details" | "uploading">("upload");
  const [video, setVideo] = useState<Video>();
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleCancel = () => {
    setIsOpen(false);

    // Reset
    setState("upload");
    setVideo(undefined);
    setUploadProgress(0);
  };

  const handleUpload = useCallback(async (video: Video, file: File) => {
    setState("details");
    setVideo(video);

    const form = new FormData();
    form.set("video", file);

    await api.patch(`videos/${video.id}/upload`, form, {
      onUploadProgress: (e) => {
        setUploadProgress(Math.floor(e.progress! * 100));
      },
    });
  }, []);

  const titles = {
    upload: "Enviar video",
    details: "Detalhes",
    uploading: "Situação",
  };

  return (
    <Modal
      centered
      title={titles[state]}
      open={isOpen}
      onCancel={handleCancel}
      style={{ maxWidth: 1000 }}
      {...(state !== "upload"
        ? {
            footer: (
              <>
                {state === "details" && (
                  <Button type="primary" onClick={() => setState("uploading")}>
                    Prosseguir
                  </Button>
                )}
                {state === "uploading" && (
                  <Button type="primary" onClick={() => setState("details")}>
                    Voltar a detalhes
                  </Button>
                )}
              </>
            ),
            width: "90%",
          }
        : { footer: <></> })}
    >
      {state === "upload" && <Upload section={section} handleUpload={handleUpload} />}
      {state === "details" && <Details video={video!} />}
      {state === "uploading" && <Uploading video={video!} uploadProgress={uploadProgress} />}
    </Modal>
  );
}

function Upload({ section, handleUpload }: { section: string; handleUpload: Function }) {
  const [showFormatError, setShowFormatError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function createVideo(file: File) {
    const mediaTypes = ["video/mp4", "video/webm", "video/AV1", "video/x-matroska"];

    if (!mediaTypes.includes(file.type)) {
      setShowFormatError(true);

      return;
    }

    setIsLoading(true);
    const response = await api.post(`sections/${section}/videos`, { name: file.name.replace(/\.[^/.]+$/, "") });
    const { video } = response as any;

    handleUpload(video, file);
  }

  return (
    <div
      className="flex flex-col items-center px-3 py-8"
      onDragEnter={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.stopPropagation();
        e.preventDefault();

        createVideo(e.dataTransfer.files[0]);
      }}
    >
      {isLoading ? (
        <BiLoaderAlt className="animate-spin m-10" size={32} />
      ) : (
        <>
          <input
            ref={fileInput}
            type="file"
            className="hidden"
            onChange={(e) => {
              createVideo(e.target.files![0]);
            }}
          />

          <FiUploadCloud size={56} />
          <h2 className="font-semibold mt-8">Arraste e solte seu arquivo de video para fazer o envio</h2>
          <h3>Suportamos arquivos mp4,webm, mkv, avi</h3>
          {showFormatError && <span className="font-bold text-red-500">Formato não suportado</span>}
          <Button type="primary" className="mt-8" onClick={() => fileInput.current?.click()}>
            Selecione os arquivos
          </Button>
        </>
      )}
    </div>
  );
}

function Details({ video }: { video: Video }) {
  const { data, isLoading, mutate } = useSWR<Video>(`/videos/${video.id}`);

  const handleUpdateDetails = debounce(async (content: any) => {
    const response = (await api.patch(`videos/${video.id}`, content)) as any;
    mutate(response.video);
  }, 1500);

  if (isLoading) return <Skeleton />;

  return (
    <div className="flex gap-12 p-3">
      <Form layout="vertical" className="flex-[6]">
        <Form.Item label="Título">
          <Input
            className="block"
            defaultValue={data?.name}
            onChange={(e) => handleUpdateDetails({ name: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="Descrição">
          <Input.TextArea
            className="block"
            defaultValue={data?.description}
            onChange={(e) => handleUpdateDetails({ description: e.target.value })}
          />
        </Form.Item>
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

function Uploading({ video, uploadProgress }: { video: Video; uploadProgress: number }) {
  const [loading, setLoading] = useState(true);
  const [processingProgress, setProgressingProgress] = useState(0);
  const [hasProcessingErrors, setHasProcessingErrors] = useState(false);

  const fullUpload = uploadProgress === 100;
  const fullProcessing = processingProgress === 100;

  const updateStateProcessing = async () => {
    const response = (await api.get(`videos/${video.id}`)) as any;

    setProgressingProgress(response.processing_progress);

    if (response.status === "sexualContent" || response.status === "error") {
      setHasProcessingErrors(true);
    }

    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fullUpload || hasProcessingErrors) return;

    updateStateProcessing();
    const interval = setInterval(updateStateProcessing, 5_000);

    return () => {
      clearInterval(interval);
    };
  }, [fullUpload, hasProcessingErrors]);

  if (loading) {
    return <div className="w-3/6 h-[40vh]"></div>;
  }

  return (
    <div className="flex flex-col items-center px-8 py-8">
      <div className="flex items-center w-full gap-6 mb-8">
        <div className="flex flex-col items-center">
          {fullUpload ? (
            <>
              <p>Enviado</p>
              <BsCloudCheck size={22} />
            </>
          ) : (
            <>
              <p>Enviando</p>
              <FiUploadCloud size={22} />
            </>
          )}
        </div>
        <div className="w-full">
          <Progress percent={uploadProgress} {...(fullUpload ? { status: "success" } : { status: "active" })} />
        </div>
        <div className="flex flex-col items-center">
          {hasProcessingErrors ? (
            <>
              <p>Falha</p>
              <BiErrorCircle size={22} />
            </>
          ) : (
            <>
              {fullUpload ? fullProcessing ? <p>Processado</p> : <p>Processando</p> : <p>Aguardando</p>}
              {fullProcessing ? <AiOutlineCheckCircle size={22} /> : <BiLoaderAlt className="animate-spin" size={22} />}
            </>
          )}
        </div>
        <div className="w-full">
          <Progress
            percent={processingProgress}
            {...(hasProcessingErrors
              ? { status: "exception" }
              : fullProcessing
              ? { status: "success" }
              : { status: "active" })}
          />
        </div>
        <div className="flex flex-col items-center">
          {hasProcessingErrors ? (
            <>
              <p>Falha</p>
              <BiErrorCircle size={22} />
            </>
          ) : (
            <>
              {fullProcessing ? <p>Publicado</p> : <p>Aguardando</p>}
              {fullProcessing ? <AiOutlineCheckCircle size={22} /> : <BiLoaderAlt className="animate-spin" size={22} />}
            </>
          )}
        </div>
      </div>
      {!fullUpload && !hasProcessingErrors && (
        <Result status="warning" title="Não feche está janela, todo progresso será perdido" />
      )}
      {!fullProcessing && !hasProcessingErrors && <Result status="info" title="Seu video está sendo processado" />}
      {hasProcessingErrors && (
        <Result
          status="error"
          title="Não foi possível processar seu vídeo"
          subTitle="Verifique o conteúdo do vídeo e tente novamente"
        />
      )}
      {fullProcessing && <Result status="success" title="Vídeo publicado com sucesso" />}
    </div>
  );
}
