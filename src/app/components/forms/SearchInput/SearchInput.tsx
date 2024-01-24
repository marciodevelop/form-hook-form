import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useFormContext, Controller, useForm } from "react-hook-form";
import { useDebounce } from "@/app/hooks/useDebounce";

interface IOptions {
  id: number
  nome: string
}

export const SearchInput = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IOptions[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('')
  const { control, formState: { errors } } = useFormContext();
  const debounced = useDebounce(search, 1000)
  
  const handleDataApi = async (search: string) => {
    try {
      const request: [{ nome: string, id: number }] = await fetch(`http://localhost:5000/data`)
      .then(response => response.json());

      const response = request.filter(({ nome }) => nome.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      if(search){
        setData(response);
      }else{
        setData([])
      }
    } catch (error) {
      console.log('erro ao buscar dados')
    }
    
    setLoading(false);
  };

  useEffect(() => {
    handleDataApi(debounced);
  }, [debounced]);

  return (
    <Controller
      name="pessoa"
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={data}
          onInputChange={(event, value) => {
            setSearch(value)
          }}
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
