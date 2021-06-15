import React from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { SetFormInput } from '../../store/supper/action'
import { FormHeader } from './FormHeader'

const SectionContainer = styled.div<{ horizontal?: boolean }>`
  margin: 25px 35px;
  ${(props) =>
    props.horizontal && 'display: flex; flex-direction:row; justify-content: space-between; align-items: baseline;'}
`

const InputContainer = styled.div<{ horizontal?: boolean }>`
  ${(props) => (props.horizontal ? 'padding: 0px 0px 0px 15px; width: 45%;' : 'padding 5px 0 0 0;')}
`

const InputText = styled.input<{ flex?: boolean; error?: FieldError | undefined }>`
  width: 80%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
  ${(props) => props.flex && 'display: flex;'}
  ${(props) => props.error && 'borderColor: red; background:#ffd1d1;'}
`

const ErrorText = styled.p`
  margin: 5px 0 0 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-family: 'Inter';
`

type Props = {
  headerName: string
  inputType: string
  inputPlaceHolder: string
  inputName: string
  inputDefaulValue: string | number
  horizontal?: boolean
}

type FormValues = {
  input: string | number
}

export const InputForm = (props: Props) => {
  const dispatch = useDispatch()
  const { register, handleSubmit, errors, setValue, setError } = useForm<FormValues>()

  const updateInput = (input) => {
    if (!input) {
      setValue('input', undefined)
      setError('input', { type: 'required' })
      return
    }

    handleSubmit((data: FormValues) => {
      dispatch(SetFormInput(data.input))
    })
  }
  return (
    <SectionContainer>
      <FormHeader headerName={props.headerName} />
      <InputContainer>
        <InputText
          flex
          error={errors.input}
          type={props.inputType}
          placeholder={props.inputPlaceHolder}
          name={props.inputName}
          defaultValue={props.inputDefaulValue}
          onChange={updateInput}
          ref={register({
            required: true,
            validate: (input) => input.trim().length !== 0,
          })}
        />
        {errors.input?.type === 'required' && <ErrorText>{props.headerName} is required.</ErrorText>}
      </InputContainer>
    </SectionContainer>
  )
}
