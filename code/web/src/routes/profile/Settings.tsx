import { useEffect, useState } from "react";
import { Button, Form, Input, Upload } from "antd";
import { omit } from "underscore";
import { PlusOutlined } from "@ant-design/icons";

import useUser from "@hooks/useUser";
import { fetch } from "@services/api";
import { useAuth } from "@contexts/Authentication";
import { toBase64 } from "@utils/converts";
import { mappedProfileIcons } from "@routes/profile";

export default function UserPerfil() {
  const auth = useAuth();
  const { user, isLoading } = useUser(auth?.user?.username);

  const [avatarFile, setAvatarFile] = useState<File>();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl);

  useEffect(() => {
    setAvatarUrl(user?.avatarUrl);
  }, [user?.avatarUrl]);

  async function handleUpdateUser(form: any) {
    const { socialLinksList, ...rest } = form;

    // Map array socialLinksList to object and omit same values
    const data = omit(rest, function (v, k) {
      return user[k as keyof typeof user] === v;
    });

    const socialLinks = omit(
      Object.keys(mappedProfileIcons).reduce((obj, key, index) => {
        return { ...obj, [key]: socialLinksList[index] };
      }, {}),
      function (v, k) {
        return user.socialLinks![k as keyof typeof user.socialLinks] === v;
      }
    );

    if (Object.keys(socialLinks).length) {
      data.socialLinks = socialLinks;
    }

    if (!avatarFile && !avatarUrl) {
      data.avatar = null;
    }

    if (avatarFile) {
      const form = new FormData();
      form.append("avatar", avatarFile);

      await fetch.patch(`users/${user?.username}`, form);
    }

    await fetch.patch(`users/${user?.username}`, data);
    location.reload();
  }

  if (isLoading) return <></>;

  return (
    <div className="max-w-lg mx-auto flex flex-col items-center py-12">
      <h2 className="self-start font-bold text-2xl mb-6">Perfil público</h2>
      <div className="mb-6 flex justify-center">
        <Upload
          listType="picture-circle"
          showUploadList={false}
          customRequest={({ file, onSuccess }) => {
            toBase64(file as File).then((url) => {
              setAvatarUrl(url);
            });

            setAvatarFile(file as File);

            onSuccess && onSuccess(file);
          }}
        >
          {avatarUrl ? (
            <div className="w-full h-full flex items-center justify-center rounded-full overflow-hidden relative">
              <img src={avatarUrl} className="w-full object-contain" />
            </div>
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
        {(avatarFile || avatarUrl) && (
          <p
            className="self-center text-xs text-bold text-blue-500 cursor-pointer"
            onClick={() => {
              setAvatarFile(undefined);
              setAvatarUrl(undefined);
            }}
          >
            Remover
          </p>
        )}
      </div>

      <Form
        layout="vertical"
        className="w-full"
        onFinish={handleUpdateUser}
        requiredMark={false}
        initialValues={user}
      >
        <Form.Item
          label="Nome"
          name="name"
          className="font-sans text-2xl"
          rules={[
            {
              type: "string",
              max: 80,
              message: "O nome deve ter no máximo 80 caracteres",
            },
            {
              type: "string",
              min: 16,
              message: "O nome deve ter no mínimo 16 caracteres",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Nome de usuário"
          name="username"
          className="font-sans text-2xl"
          rules={[
            {
              required: true,
              message: "Nome de usuário não pode ficar em branco",
            },
            {
              type: "string",
              max: 28,
              message: "O nome de usuário deve ter no máximo 16 caracteres",
            },
            {
              type: "string",
              min: 8,
              message: "O nome de usuário deve ter pelo menos 8 caracteres",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Biografia"
          name="biography"
          className="font-sans text-2xl"
          rules={[
            {
              type: "string",
              max: 360,
              message: "A biografia deve ter no máximo 360 caracteres",
            },
            {
              type: "string",
              min: 32,
              message: "A biografia deve ter pelo menos 32 caracteres",
            },
          ]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Profissão"
          name="profession"
          className="font-sans text-2xl"
          rules={[
            {
              type: "string",
              max: 80,
              message: "A profissão deve ter no máximo 80 caracteres",
            },
            {
              type: "string",
              min: 4,
              message: "A profissão deve ter pelo menos 4 caracteres",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.List
          name="socialLinksList"
          initialValue={Object.values(user?.socialLinks!)}
        >
          {(fields) => (
            <div>
              {fields.map((field) => (
                <Form.Item
                  {...field}
                  {...(field.key === 0 && { label: "Links" })}
                >
                  <Input
                    addonBefore={Object.values(mappedProfileIcons)[field.key](
                      14
                    )}
                  />
                </Form.Item>
              ))}
            </div>
          )}
        </Form.List>

        <Form.Item className="mt-12">
          <Button type="primary" htmlType="submit">
            Salvar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
