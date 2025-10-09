import { client } from "@/lib/api/client/client.gen";

const configureClient = () => {
  const baseURL = process.env.API_BASE_URL;

  client.setConfig({
    baseUrl: baseURL,
  });
};

configureClient();