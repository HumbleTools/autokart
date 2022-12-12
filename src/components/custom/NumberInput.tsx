import { FieldError, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { FieldErrorDisplay } from './FieldErrorDisplay'

export interface NumberInputProps {
  id: string
  label: string
  hiddenInput: boolean
  fieldName: string
  fieldRules: any
  getValue: () => number
  setValue: UseFormSetValue<any>
  register: UseFormRegister<any>
  error?: FieldError
}

export const NumberInput = (props: NumberInputProps) => {
  const { getValue, setValue, fieldName, hiddenInput, id, label, fieldRules, error } = props
  const value = getValue()
  const incrementValue = () => {
    setValue(fieldName, value + 1)
  }
  const decrementValue = () => {
    if (value > 0) setValue(fieldName, value - 1)
  }
  return <>
        <label htmlFor={id}>{label}</label>
        <div className="updown-display">
            {hiddenInput && <div>{value}</div>}
            <input id={id} type={hiddenInput ? 'hidden' : 'number'}
                {...props.register(fieldName, fieldRules)} />
            <div className="buttons">
                <div className="udbutton" onClick={incrementValue}>
                    <div className="dash h-dash"></div>
                    <div className="dash v-dash"></div>
                </div>
                <div className="udbutton" onClick={decrementValue}>
                    <div className="dash h-dash"></div>
                </div>
            </div>
        </div>
        <FieldErrorDisplay fieldError={error} /><br />
    </>
}
