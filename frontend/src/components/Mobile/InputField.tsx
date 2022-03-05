import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import { FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from 'antd'

const RedText = styled.span`
  color: #f37562;
  padding-right: 5px;
  font-family: Lato;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px 0px;
`

const StyledInput = styled(Input)<{ error?: boolean }>`
  &.ant-input {
    background: #f3f3f9;
    width: 100%;
    border-radius: 10px;
    border: 1px solid ${(props) => (props.error ? '#f37562' : '#f3f3f9')};
    padding: 5px 15px;
    margin: 0;
  }
  &.ant-input::placeholder {
    color: ${(props) => (props.error ? '#f37562' : '#bfbfbf')};
    font-size: 0.8rem;
  }
`

const { TextArea } = Input
const StyledTextArea = styled(TextArea)<{ error?: boolean }>`
  &.ant-input {
    background: #f3f3f9;
    width: 100%;
    border-radius: 10px;
    padding: 5px 15px;
    margin: 0;
    resize: none;
    border: 1px solid ${(props) => (props.error ? '#f37562' : '#f3f3f9')};
  }
  &.ant-input::placeholder {
    color: ${(props) => (props.error ? '#f37562' : '#bfbfbf')};
    font-size: 0.8rem;
  }
`

const StyledTitle = styled.div`
  font-family: Lato;
  color: black;
  font-size: 15px;
  font-weight: bold;
  line-height: 30px;
  margin-right: 20px;
  white-space: nowrap;
`

type InputFieldProps = {
  title: string
  placeholder: string
  name: string
  maxLength?: number
  // value?: string
  // setValue?: Dispatch<SetStateAction<string>> | ((input: string) => void)
  textArea?: boolean
  errors: any
  isRequired?: boolean
  register: UseFormRegister<FieldValues>
}

export default function InputField(props: InputFieldProps) {
  const RedAsterisk = <RedText>*</RedText>
  const { title, placeholder, name, textArea, errors, isRequired, register } = props
  // console.log(errors)
  // console.log('name', errors.name)

  return (
    <Container>
      {title && (
        <StyledTitle>
          {title}
          {isRequired && RedAsterisk}
        </StyledTitle>
      )}
      {textArea ? (
        <StyledTextArea
          placeholder={errors ? errors.message : placeholder}
          rows={4}
          error={!!errors}
          // {...register(name, isRequired ? { required: `${title} is required` } : {})}
        />
      ) : (
        <StyledInput
          placeholder={errors ? errors.message : placeholder}
          error={!!errors}
          // {...register(name, isRequired ? { required: `${title} is required` } : {})}
        />
      )}
    </Container>
  )
}
