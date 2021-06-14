import React from 'react'
import { FieldError, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { SetVerticalFormInput } from '../../store/supper/action'
import { FormHeader } from './FormHeader'

const VertSectionContainer = styled.div`
  margin: 25px 35px;
`

const VertInputContainer = styled.div`
  padding 5px 0 0 0;
`

const InputText = styled.input<{ flex?: boolean; error?: FieldError | undefined }>`
  width: 80%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
  ${(props) => props.flex && 'display: flex;'}
  ${(props) => props.error && 'borderColor: red;'}
  ${(props) => props.error && 'background:#ffd1d1;'}
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
}

type FormValues = {
  input: string | number
}

export const VerticalInputForm = (props: Props) => {
  const dispatch = useDispatch()
  const { register, handleSubmit, errors } = useForm<FormValues>()

  const updateInput = () => {
    handleSubmit((data: FormValues) => {
      dispatch(SetVerticalFormInput(data.input))
    })
  }
  return (
    <VertSectionContainer>
      <FormHeader headerName={props.headerName} />
      <VertInputContainer>
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
      </VertInputContainer>
    </VertSectionContainer>
  )
}
