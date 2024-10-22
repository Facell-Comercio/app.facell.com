import { useAuthStore } from "@/context/auth-store";
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

// Criando o contexto do socket com o tipo definido
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Hook para acessar o contexto do Socket
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// Tipo das props para o provider
interface SocketProviderProps {
  children: ReactNode;
}

// URL do backend onde o Socket.io está rodando
const SOCKET_URL = import.meta.env.VITE_BASE_URL_API;

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const user = useAuthStore().user;
  useEffect(() => {
    const socketIo = io(SOCKET_URL, {
      query: {
        user: JSON.stringify(user),
      },
    });

    // Guardando a conexão do socket
    setSocket(socketIo);

    // Desconectar o socket quando o componente for desmontado
    return () => {
      socketIo.disconnect();
    };
  }, []);

  const value = useMemo(() => ({ socket }), [socket]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
