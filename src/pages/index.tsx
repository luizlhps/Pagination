import { useCallback, useEffect, useMemo, useState } from "react";
import { IListagemPessoas, pessoasService } from "../../services/api/pessoas/PessoasService";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import { useDebounse } from "../../hooks";

//material ui
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IconButton, LinearProgress, Pagination, TableFooter } from "@mui/material";
import { Environment } from "./environment";
import Icon from "@mui/material/Icon";

export default function Home() {
  const router = useRouter();
  const { query } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const [searchValue, setSearchValue] = useState((query.busca as string) || "");
  const [row, setRow] = useState<IListagemPessoas[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const { debouse } = useDebounse();
  //const debouse = useDebounse().debouse

  console.log(query.busca);
  useEffect(() => {
    setLoading(true);

    debouse(() => {
      pessoasService.getAll(Number(query.pagina), searchValue).then(resultado => {
        setLoading(false);

        if (resultado instanceof Error) {
          console.error("Ocorreu um erro ao buscar");
        } else {
          setRow(resultado.data);
          setTotal(resultado.totalCount);
        }
      });
    });
    console.log(total);
  }, [searchValue, Number(query.pagina) || 1]);

  useEffect(() => {
    // Atualiza o estado do input searchValue com o valor do parâmetro de busca
    setSearchValue((query.busca as string) || "");
  }, [query.busca]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    if (Number(query.page || 1) === 2) {
      console.log("estou aqui");
    }
  }, []);

  const seachHendle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchValue(inputValue);

    if (e.target.value === "") {
      router.push({
        pathname: router.pathname,
        query: { busca: "", pagina: "1" },
      });
    } else {
      router.push(pathname + "?" + createQueryString("busca", inputValue));
      router.push({
        pathname: router.pathname,
        query: { busca: inputValue, pagina: "1" },
      });
    }
  };

  const handlePageChange = (e: any, newPage: any) => {
    console.log("valores", newPage);
    const { busca } = query;
    router.push(
      {
        pathname: router.pathname,
        query: { busca, pagina: newPage.toString() },
      },
      undefined,
      { shallow: true },
    );
  };
  console.log("minha pagina:", query.pagina || "");

  return (
    <>
      <p></p>
      {/* using useRouter */}
      <button onClick={() => {}}>ASC</button>
      <input type="text" onChange={seachHendle} value={searchValue} />
      <TableContainer component={Paper} variant="outlined" sx={{ width: "auto", marginTop: 3, paddingY: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ações</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {row.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <IconButton size="small">
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton size="small">
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{row.nomeCompleto}</TableCell>
                <TableCell>{row.email}l</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {row.length === 0 && <caption>{Environment.LISTAGEM_VAZIO}</caption>}

          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>{loading && <LinearProgress variant="indeterminate" />}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                {total > 0 && total > Environment.LIMIT_DE_LINHAS && (
                  <Pagination
                    count={Math.ceil(total / Environment.LIMIT_DE_LINHAS)}
                    page={Number(query.pagina) || 1}
                    onChange={handlePageChange}
                  />
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Icon>star</Icon>;
    </>
  );
}
