import HttpClient from "core/HttpClient";

const messageService = {
  all: (threadId) => {
    return HttpClient.get("/message" + threadId);
  },
  create: (data) => {
    return HttpClient.post("/message", { body: data });
  },
  chat: (data, onMessage) => {
    return HttpClient.stream("/message/chat", { body: data, onMessage });
  },
  delete: (id) => {
    return HttpClient.delete("/message/" + id);
  },
};

export default messageService;
