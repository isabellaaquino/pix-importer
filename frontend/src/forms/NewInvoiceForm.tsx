import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { useInvoice } from "../hooks/api/useInvoice";
import { BankInstitutions } from "../models/Invoices";
import {
  NewInvoiceImportFormData,
  newInvoiceImportSchema,
} from "../schemas/invoiceImportSchema";

function NewTransactionForm() {
  const { uploadInvoices } = useInvoice();
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<NewInvoiceImportFormData>({
    resolver: zodResolver(newInvoiceImportSchema),
    defaultValues: {
      invoices: undefined,
      institution: BankInstitutions.SANTANDER,
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: uploadInvoices,
    onSuccess: (response: any) => {
      enqueueSnackbar(response.message, {
        variant: "info",
        autoHideDuration: 3000,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
    onError: (err: any) => {
      enqueueSnackbar(err.response.data.message, {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    },
  });

  async function importFiles(data: NewInvoiceImportFormData) {
    await mutateAsync({
      invoices: data.invoices,
      institution: data.institution,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(importFiles)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        width: "500px",
        marginTop: 10,
      }}
    >
      <Controller
        name="invoices"
        control={control}
        render={() => (
          <FormControl sx={{ width: "100%" }}>
            <TextField
              fullWidth
              autoFocus
              type="file"
              helperText={errors.invoices?.message}
              error={!!errors.invoices}
              onChange={(e: any) => {
                setValue("invoices", e.target.files);
              }}
              size="small"
              inputProps={{ multiple: true }}
            />
          </FormControl>
        )}
      />

      <Controller
        name="institution"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormControl sx={{ width: "100%" }}>
            <InputLabel>Instuição Bancária</InputLabel>
            <Select
              size="small"
              value={value}
              label="Bank Institution"
              onChange={onChange}
            >
              {Object.values(BankInstitutions).map((item, index) => {
                return (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      ></Box>

      <Button type="submit" variant="contained">
        Importar
      </Button>
    </form>
  );
}

export default NewTransactionForm;
