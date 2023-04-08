import { Environment } from "@/pages/environment";
import { Api } from "../axios-config";

export interface IListagemPessoas {
  id: number;
  email: string;
  cidadeId: number;
  nomeCompleto: string;
}
export interface IDetalhePessoa {
  id: number;
  email: string;
  cidadeId: number;
  nomeCompleto: string;
}
export type TPessoasComTotalCount = {
  data: IListagemPessoas[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ""): Promise<TPessoasComTotalCount | Error> => {
  try {
    const UrlRelativa = `/pessoas?_page=${page}&limit=${Environment.LIMIT_DE_LINHAS}&nomeCompleto_like=${filter}`;
    const { data, headers } = await Api.get(UrlRelativa);
    //equiavalente const resp = await api.get("/pessoas") resp.data

    if (data) {
      return {
        data,
        totalCount: Number(headers["x-total-count"] || Environment.LIMIT_DE_LINHAS),
      };
    }
    return new Error("Erro ao listar os registros");
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || "Erro ao listar os registros");
  }
};

const getById = async (id: number): Promise<IDetalhePessoa | Error> => {
  try {
    const { data, headers } = await Api.get(`/pessoas/${id}`);

    if (data) {
      return data;
    }

    return new Error("Erro ao consultar o registro");
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || "Erro ao consultar o registro");
  }
};

const create = async (dados: Omit<IDetalhePessoa, "id">): Promise<void | Error> => {
  try {
    const { data, headers } = await Api.post<IDetalhePessoa>(`/pessoas`, dados);
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || "Erro ao registrar");
  }
};

const updateById = async (id: number, dados: IDetalhePessoa): Promise<void | Error> => {
  try {
    await Api.put(`/pessoas/${id}`, dados);

    return new Error("Erro ao registrar");
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || "Erro ao registrar");
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/pessoas/${id}`);

    return new Error("Erro ao apagar o registro");
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || "Erro ao apagar o registro");
  }
};
export const pessoasService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
