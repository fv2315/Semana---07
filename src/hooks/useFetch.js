
import { useEffect, useState } from "react";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    async function obtenerDatos() {
      try {
        setLoading(true);
        setError(null);

        const respuesta = await fetch(url, {
          signal: controller.signal,
        });

        if (!respuesta.ok) {
          throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const resultado = await respuesta.json();
        setData(resultado);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "No se pudieron obtener los datos.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    obtenerDatos();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
