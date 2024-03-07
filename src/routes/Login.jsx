import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import iconFacell from "@/assets/images/facell-192x192.png";
import { useContext, useEffect, useState } from "react";
import authContext from "@/context/authProvider";
import ErrorAlert from "@/components/ui/error-alert";

const formSchema = z.object({
  email: z.string(),
  senha: z.string().min(6, {
    message: "Senha precisa conter no mínimo 6 caracteres.",
  }),
});

const Login = () => {
  const { login } = useContext(authContext);

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const [statusLogin, setStatusLogin] = useState(null);
  const [errorMessage, setErrorMessage] = useState('Ocorreu um erro ao tentar realizar o login');

  // useEffect(()=>{
  //   console.log(statusLogin)
  //   console.log(errorMessage)
  // }, [statusLogin])

  // 2. Define a submit handler.
  async function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setStatusLogin("pending");
    const result = await login(values)
    if(!result?.error){
      setStatusLogin("success");
    }else{
      setStatusLogin("error");
      setErrorMessage(result.error)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex flex-col items-center gap-4 backdrop-brightness-125 shadow-xl rounded-xl p-7 min-w-96">
          <div className="flex w-full justify-start items-center font-medium">
            <img src={iconFacell} className="size-14" />
            <span>Facell</span>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="text-left">
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
              <FormItem className="text-left">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {statusLogin && statusLogin === 'error' && <ErrorAlert message={errorMessage}/>}

          <Button type="submit" variant="destructive" disabled={statusLogin === 'pending' ? true : false}>
            Entrar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
