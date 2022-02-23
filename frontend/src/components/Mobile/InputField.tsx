import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import { FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from 'antd'

type InputFieldProps = {
  title: string
  placeholder: string
  value?: string
  setValue?: Dispatch<SetStateAction<string>> | ((input: string) => void)
  textArea?: boolean
  onChange?: () => void
  errors: { [x: string]: any }
  isRequired?: boolean
  register: UseFormRegister<FieldValues>
}

const RedText = styled.text`
  color: red;
  padding-right: 5px;
  font-family: Inter;
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

const StyledInput = styled(Input)`
  &.ant-input {
    background: #f3f3f9;
    width: 100%;
    border-radius: 10px;
    border: 1px solid #f3f3f9;
    padding: 5px 15px;
    margin: 0;
  }
  &.ant-input::placeholder {
    color: #bfbfbf;
    font-size: 0.8rem;
  }
`

const { TextArea } = Input
const StyledTextArea = styled(TextArea)`
  &.ant-input {
    background: #f3f3f9;
    width: 100%;
    border-radius: 10px;
    border: 1px solid;
    padding: 5px 15px;
    margin: 0;
    resize: none;
  }
  &.ant-input::placeholder {
    color: #bfbfbf;
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

export default function InputField({ title, placeholder, textArea, errors, isRequired, register }: InputFieldProps) {
  const RedAsterisk = <RedText>*</RedText>

  return (
    <Container>
      {title && (
        <StyledTitle>
          {title}
          {isRequired && RedAsterisk}
        </StyledTitle>
      )}
      {textArea ? (
        <StyledTextArea placeholder={placeholder} rows={4} {...register(title, { required: isRequired })} />
      ) : (
        <StyledInput placeholder={placeholder} {...register(title, { required: isRequired })} />
      )}
    </Container>
  )
}
