import { FieldError } from 'react-hook-form'

const errorMessageStyle = {
  color: 'red',
  fontWeight: 'bold',
  fontSize: 'small'
}

interface FieldErrorDisplayProps {
  fieldError?: FieldError
}

export const FieldErrorDisplay = (props: FieldErrorDisplayProps) => {
  return props.fieldError?.message
    ? <>
        <span style={errorMessageStyle}>{props.fieldError.message}</span>
        <br />
    </>
    : <></>
}
