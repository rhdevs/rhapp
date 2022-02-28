import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'

import { Input } from 'antd'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px 0px;
`

const StyledInput = styled(Input)<{ hasError?: boolean }>`
  &.ant-input {
    background: #f3f3f9;
    width: 100%;
    border-radius: 30px;
    border: 1px solid ${(props) => (props.hasError ? 'red' : '#f3f3f9')};
    padding: 5px 15px;
    margin: 0;
    ${(props) => props.hasError && `background: #ffd1d1;`}
  }
  &.ant-input::placeholder {
    color: #bfbfbf;
    font-size: 0.8rem;
  }
`

const { TextArea } = Input
const StyledTextArea = styled(TextArea)<{ hasError?: boolean }>`
  &.ant-input {
    background: #f3f3f9;
    width: 100%;
    border-radius: 20px;
    border: 1px solid ${(props) => (props.hasError ? 'red' : '#f3f3f9')};
    padding: 5px 15px;
    margin: 0;
    resize: none;
    ${(props) => props.hasError && `background: #ffd1d1;`}
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

type InputFieldProps = {
  title?: string
  placeholder: string
  value?: string
  setValue?: Dispatch<SetStateAction<string>> | ((input: string) => void)
  textArea?: boolean
  hasError?: boolean
  onChange?: () => void
}

export default function InputField({
  title,
  placeholder,
  value,
  setValue,
  textArea,
  onChange,
  hasError,
}: InputFieldProps) {
  const [inputValue, setInputValue] = useState('')

  return (
    <Container>
      {title && <StyledTitle>{title}</StyledTitle>}
      {textArea ? (
        <StyledTextArea
          hasError={hasError}
          placeholder={placeholder}
          value={value ?? inputValue}
          onChange={onChange ?? ((e) => (setValue ? setValue(e.target.value) : setInputValue(e.target.value)))}
          rows={4}
        />
      ) : (
        <StyledInput
          hasError={hasError}
          placeholder={placeholder}
          value={value ?? inputValue}
          onChange={onChange ?? ((e) => (setValue ? setValue(e.target.value) : setInputValue(e.target.value)))}
        />
      )}
    </Container>
  )
}
