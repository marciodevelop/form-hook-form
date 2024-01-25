import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useFormContext, Controller, useForm } from "react-hook-form";
import { useDebounce } from "@/app/hooks/useDebounce";

interface IOptions {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export const SearchInput = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IOptions[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('')
  const { control, formState: { errors } } = useFormContext();
  const debounced = useDebounce(search, 2000)
  
  const handleDataApi = async (search: string) => {
    try {
      const fetchApi: { products: IOptions[] } = await fetch(`https://dummyjson.com/products/search?q=${search}`)
      .then(response => response.json());
      setData(fetchApi.products)
    } catch (error) {
      console.log('erro ao buscar dados')
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(open){
      handleDataApi(debounced);
    }
  }, [debounced, open]);

  useEffect(() => {
    if(open){
      setLoading(true)
    }
  }, [search, open])

  useEffect(() => {
    if(loading){
      setData([])
    }
  }, [loading])

  return (
    <Controller
      name="produto"
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={data}
          onInputChange={(event, value) => {
            setSearch(value)
          }}
          getOptionLabel={(option) => option.title || ""}
          loading={loading}
          loadingText="Carregando..."
          noOptionsText="Nenhuma opção"
          onOpen={() => setOpen(true)}
          onChange={(event, item) => field.onChange(item ? item.id : null)}
          value={field.value ? data.find(option => option.id === field.value) : null}
          onClose={() => setOpen(false)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!errors.porduto} 
              helperText={errors.produto?.message && String(errors.produto?.message)}
              label="Produto"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            /> 
          )}
        />
      )}
    />)
};
