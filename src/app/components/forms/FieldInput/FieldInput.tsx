import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'

type FieldInputProps = TextFieldProps

export const FieldInput: React.FC<FieldInputProps> = React.forwardRef((props, ref) => {
  return (
      <TextField ref={ref} {...props} />
  )
})

FieldInput.displayName = 'FieldInput'
