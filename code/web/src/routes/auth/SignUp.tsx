import { useState } from "react";
import { Button, Form, Input } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { debounce } from "lodash-es";

import { useAuth } from "@contexts/Authentication";
import { api } from "@services/api";

import logo from "@assets/undraw.svg";

interface ISignUpForm {
  username: string;
  password: string;
  email: string;
  password_confirmation: string;
}

export default function SignUp() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();

  async function handleSubmit(form: ISignUpForm) {
    try {
      const response = await api.post("/auth/signup", {
        ...form,
      });
      auth.signIn({
        token: response.token,
      });
      navigate(0);
    } catch (error) {}
  }

  const checkAlreadyUsed = debounce((field, value, setState) => {
    api
      .post("users/check", { [field]: value })
      .then(() => {
        setState(null);
      })
      .catch(() => {
        if (field === "username") {
          return setState("Nome de usuário já está em uso");
        }
        setState("Email já está em uso");
      });
  }, 1000);

  const [usernameErrorStatus, setUsernameErrorStatus] = useState<string | null>(null);
  const [emailErrorStatus, setEmailErrorStatus] = useState<string | null>(null);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.2fr,1fr]">
      <div className="bg-violet-600 hidden items-center justify-center lg:flex">
        <img className="w-3/5" src={logo} alt="" />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <h1 className="font-sans font-bold text-2xl text-center mb-6">Cadastrar</h1>
          <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              label="Nome de usuário"
              name="username"
              {...(usernameErrorStatus && { validateStatus: "error" })}
              help={usernameErrorStatus}
              rules={[
                {
                  required: true,
                  message: "Nome de usuário não informado",
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
              <Input
                onChange={({ target: { value } }) => checkAlreadyUsed("username", value, setUsernameErrorStatus)}
                className=""
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              className="mt-8"
              {...(emailErrorStatus && { validateStatus: "error" })}
              help={emailErrorStatus}
              rules={[
                {
                  required: true,
                  message: "Email não informado",
                },
                {
                  type: "email",
                  message: "O email informado não válido",
                },
              ]}
            >
              <Input onChange={({ target: { value } }) => checkAlreadyUsed("email", value, setEmailErrorStatus)} />
            </Form.Item>
            <Form.Item
              label="Senha"
              name="password"
              className="mt-8"
              rules={[
                {
                  required: true,
                  message: "Senha não informada",
                },
                {
                  type: "string",
                  min: 8,
                  message: "A senha deve ter pelo menos 8 caracteres",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              className="mt-8"
              label="Confirmar Senha"
              name="password_confirmation"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Confirme sua senha",
                },
                ({ getFieldValue }) => ({
                  async validator(_, value) {
                    if (!value || getFieldValue("password") === value) return;

                    throw new Error("As senha não se coincidem");
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item className="mt-12">
              <Button type="primary" htmlType="submit" className="w-full">
                Cadastrar
              </Button>
              <span className="text-center block mt-6">
                Já tem conta?{" "}
                <Link className="text-cyan-600" to={`/auth/signin${search}`}>
                  Entre
                </Link>
              </span>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
