import { useState, useEffect } from "react";
import threadService from "shared/services/threadService";

const useThread = () => {
  const [loading, setLoading] = useState(null);
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await threadService.all();
      setThreads(response);
    })();
  }, []);

  const createThread = async (title) => {
    setLoading('create');

    const response = await threadService.create({ title });
    setThreads((prev) => ([
      ...prev,
      { ...response }
    ]));

    setLoading(null);

    setCurrentThread(response);

    return response;
  };

  const deleteThread = async (id) => {
    setLoading('delete');

    await threadService.delete(id);

    setThreads((prev) => prev.filter(item => item.id != id));

    setLoading(null);
  };

  return { threads, createThread, deleteThread, currentThread, setCurrentThread, loading };
};

export default useThread;
