import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HomeIcon from "./components/HomeIcon";
import LatestTransactions from "./components/LatestTransactions";
import ImportInvoice from "./modals/ImportInvoices";
import { darkTheme } from "./theme";

export const client_id = Date.now();

function App() {
  let ws: WebSocket | null = null; // Websocket
  useEffect(() => {
    ws = new WebSocket(`ws://127.0.0.1:8000/ws/${client_id}`);
    ws.onopen = () => ws?.send("Conexão via React"); // Primeira conexão com socket
    ws.onerror = () => {
      enqueueSnackbar("Requisição inválida.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    };

    ws.onmessage = (e) => {
      const response = JSON.parse(e.data);
      if (response.result) {
        let incomingItems: any = response.result;
        const currentItems = JSON.parse(localStorage.getItem("comprovantes")!!);
        const updatedItems =
          currentItems?.length > 0
            ? incomingItems.concat(currentItems)
            : incomingItems;

        localStorage.setItem("comprovantes", JSON.stringify(updatedItems));
      }
      enqueueSnackbar(response.message, {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    };
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const showTransactions = searchParams.get("comprovantes") === "1";

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider maxSnack={3}>
          <AppBar position="static">
            <Toolbar sx={{ backgroundColor: "#141313" }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 1 }}
              ></IconButton>
              <Container component="div" sx={{ flexGrow: 1 }}>
                <Button
                  color="inherit"
                  onClick={() =>
                    setSearchParams((state) => {
                      if (state.get("comprovantes"))
                        state.delete("comprovantes");
                      return state;
                    })
                  }
                >
                  Home
                </Button>
                <Button
                  color="inherit"
                  onClick={() =>
                    setSearchParams((state) => {
                      if (!state.get("comprovantes"))
                        state.set("comprovantes", "1");
                      return state;
                    })
                  }
                >
                  Comprovantes Importados
                </Button>
              </Container>
              {!showTransactions && (
                <Button
                  variant="contained"
                  size="medium"
                  sx={{ marginRight: 2 }}
                  startIcon={<FileUploadIcon />}
                  onClick={() =>
                    setSearchParams((state) => {
                      if (!state.get("invoice")) state.set("invoice", "1");
                      return state;
                    })
                  }
                >
                  Importar novos comprovantes
                </Button>
              )}
            </Toolbar>
          </AppBar>
          {showTransactions && <LatestTransactions />}
          {!showTransactions && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "100px",
              }}
            >
              <HomeIcon />
            </div>
          )}
          <ImportInvoice />
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
