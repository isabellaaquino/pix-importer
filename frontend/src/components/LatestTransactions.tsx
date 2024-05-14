import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridValueFormatterParams,
} from "@mui/x-data-grid";

function LatestTransactions() {
  const data: any = JSON.parse(localStorage.getItem("comprovantes")!!);

  const columns: GridColDef[] = [
    {
      field: "from",
      headerName: "De",
      width: 500,
    },
    {
      field: "to",
      headerName: "Para",
      width: 500,
    },
    {
      field: "value",
      headerName: "Valor",
      width: 500,
      valueFormatter: (params: GridValueFormatterParams) => {
        return parseFloat(params.value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
      },
    },
    {
      field: "date",
      headerName: "Data",
      width: 200,
    },
  ];

  function transformData(data: any): GridRowsProp | [] {
    return data
      ? data.map((item: any, index: Number) => ({
          id: index,
          to: item.to,
          from: item.from,
          value: item.value,
          date: item.date,
        }))
      : [];
  }

  return (
    <>
      <DataGrid rows={transformData(data)} columns={columns} autoHeight />
    </>
  );
}

export default LatestTransactions;
