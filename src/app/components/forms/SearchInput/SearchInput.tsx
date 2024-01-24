import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useFormContext, Controller, useForm } from "react-hook-form";

interface IOptions {
  id: number
  nome: string
}

export const SearchInput = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IOptions[]>([]);
  const [open, setOpen] = useState(false);
  const { control, formState: { errors } } = useFormContext();
  
  const handleDataApi = async () => {
    setLoading(true);
    const request = await fetch('http://localhost:5000/data')
      .then(response => response.json());
    setData(request);
    setLoading(false);
  };

  useEffect(() => {
    handleDataApi();
  }, []);

  return (
    <Controller
      name="pessoa"
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={data}
          getOptionLabel={(option) => option.nome || ""}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={loading}
          loadingText="Carregando..."
          noOptionsText="Nenhuma opção"
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onChange={(event, item) => field.onChange(item ? item.id : null)}
          value={field.value ? data.find(option => option.id === field.value) : null}
          renderInput={(params) => (
            <TextField
              {...params} 
              error={!!errors.pessoa} 
              helperText={errors.pessoa?.message && String(errors.pessoa?.message)}
              label="Pessoa" />
          )}
        />
      )}
    />)
};
