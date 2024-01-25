'use client'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldInput } from './components/forms/FieldInput'
import { SearchInput } from './components/forms/SearchInput'
import { Button } from '@mui/material'
import { Form, ContentForm } from './styles/page.styled'
import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'

const validateSchema = z.object({
  produto: z.number().positive({
    message: 'campo produto é obrigatório!'
  }),
  telefone: z.string().min(10, {
    message: 'digite pelo menos 10 números!'
  }),
  email: z.string().email({
    message: 'coloque um email válido!'
  })
})

export default function RegisterUser () {

  const methods = useForm({
    defaultValues: {
      produto: 0,
      telefone: null,
      email: null,
    },
    resolver: zodResolver(validateSchema)
  })

  const { errors } = methods.formState

  const onSubmit = (data: any) => {
    console.log(data)
  }


  return (
      <FormProvider {...methods}>
        <ContentForm >
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <SearchInput  />
          <FieldInput 
            {...methods.register('telefone')} 
            error={!!errors.telefone} 
            helperText={errors.telefone?.message}
            type='tel' 
            variant='outlined'
            label='Telefone' 
            placeholder='(00) 9 0000-0000' />
          <FieldInput 
            {...methods.register('email')}
            error={!!errors.email} 
            helperText={errors.email?.message}
            type='email' 
            variant='outlined' 
            label='Email' 
            placeholder='email@email.com' />
          <Button disabled={!!errors.email || !!errors.produto || !!errors.telefone} color='primary' type='submit' variant='contained'>enviar</Button>
        </Form>
        </ContentForm>
      </FormProvider>
    
  )
}