import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import iconFacell from "@/assets/images/facell-192x192.png";
import ErrorAlert from "@/components/ui/error-alert";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/context/auth-store";
import { useState } from "react";
import { api } from "@/lib/axios";

const formSchema = z.object({
  email: z.string(),
  senha: z.string().min(6, {
    message: "Senha precisa conter no mínimo 6 caracteres.",
  }),
});

const useLogin = () => {
  const navigate = useNavigate()

  const login = useAuthStore(state => state.login);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async ({ email, senha }: { email: string, senha: string }) => {
    setLoginLoading(true);
    setLoginError('');

    try {
      const { data } = await api.post('/auth/login', { email, senha });
      const user = data.user
      const token = data.token

      if (user && token) {
        login({ user, token });
        navigate('/');
      }
    } catch (error) {
      //@ts-ignore
      setLoginError(error?.response?.data?.message || error?.message || 'Falha no login!');
      
    }finally{
      setLoginLoading(false);
    }
  };

  return { handleSubmit, loginLoading, loginError };
};

const Login = () => {

  const { handleSubmit, loginLoading, loginError } = useLogin();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 flex flex-col items-center gap-4 backdrop-brightness-125 shadow-xl rounded-xl p-7 min-w-[400px]">
          <div className="flex w-full justify-start items-center font-medium">
            <img src={iconFacell} className="size-14" />
            <span>Facell</span>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="text-left w-60">
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type='email' placeholder="Seu email facell" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="senha"
            render={({ field }) => (
              <FormItem className="text-left w-60">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loginError && <ErrorAlert message={loginError} />}

          <Button type="submit" variant="destructive" disabled={loginLoading}>
            {loginLoading ? 'Entrando' : 'Entrar'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
