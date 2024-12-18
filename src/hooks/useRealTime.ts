// src/hooks/useRealTime.js

import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

export const useRealTime = () => {
  const [realTime, setRealTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTime = async () => {
      setLoading(true);
      try {
        const data = await api(`/realtime`).then((res) => res.data);
        setRealTime(new Date(data));
      } catch (err: any) {
        setError(err.message || "");
      } finally {
        setLoading(false);
      }
    };

    fetchTime();
  }, []);

  return { realTime, loading, error };
};
