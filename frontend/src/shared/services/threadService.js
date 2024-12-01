import HttpClient from "core/HttpClient";

const threadService = {
  all: () => {
    return HttpClient.get("/thread");
  },
  create: (data) => {
    return HttpClient.post("/thread", { body: data });
  },
  delete: (id) => {
    return HttpClient.delete("/thread/" + id);
  },
};

export default threadService;
