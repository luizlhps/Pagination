import axios from "axios";
import { errorInteceptor, responseInteceptor } from "./interceptors";
import { Environment } from "@/pages/environment";

const Api = axios.create({
  baseURL: Environment.URL_BASE,
});

Api.interceptors.response.use(
  (response) => responseInteceptor(response),
  (error) => errorInteceptor(error)
);

export { Api };
