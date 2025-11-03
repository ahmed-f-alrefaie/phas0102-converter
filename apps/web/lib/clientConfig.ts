import { client } from "@/lib/api/client/client.gen";

const configureClient = () => {
  const baseURL = "http://178.128.171.250:8000";

  client.setConfig({
    baseUrl: baseURL,
  });
};
console.log("Configuring client with base URL:", process.env.API_BASE_URL, client);
configureClient();