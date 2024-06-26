import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import iconFacell from "@/assets/images/facell-192x192.png";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Este campo é obrigatório" })
    .email("Este não é um email válido"),
});

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async ({ email }: { email: string }) => {
    try {
      setIsLoading(true);
      await api.post("/auth/recuperar-senha", { email });
      navigate("/login");
      toast({
        title: "Sucesso",
        description:
          "Enviamos um e-mail com instruções para recuperar sua senha",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro",
        description: "Falha ao tentar recuperar senha",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-2 flex flex-col items-center gap-4 backdrop-brightness-125 shadow-xl rounded-xl p-7 min-w-[400px]"
        >
          <div className="flex w-full justify-center items-center font-medium">
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
                  <Input
                    type="email"
                    placeholder="Seu email facell"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="destructive"
            className="w-60"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex gap-2">
                <FaSpinner size={18} className="animate-spin" /> Recuperando
              </span>
            ) : (
              "Recuperar"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RecuperarSenha;
