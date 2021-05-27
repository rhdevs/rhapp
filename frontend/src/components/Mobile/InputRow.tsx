import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'

import { Input } from 'antd'

const Row = styled.div`
  display: flex;
  width: 100%;
  margin: 10px 0px;
`

const Column = styled.div`
  width: 100%;
  margin: 10px 0px;
`

const StyledInput = styled(Input)<{ hasError?: boolean }>`
  &.ant-input {
    width: 100%;
    border-radius: 30px;
    border: 1px solid ${(props) => (props.hasError ? 'red' : '#d9d9d9')};
    padding: 5px 10px;
    margin: 0px 0px 0px 0px;
    ${(props) => props.hasError && `background: #ffd1d1;`}
  }
  &.ant-input::placeholder {
    color: #7d7d7d;
  }
`

const { TextArea } = Input
const StyledTextArea = styled(TextArea)<{ hasError?: boolean }>`
  &.ant-input {
    width: 100%;
    border-radius: 15px;
    border: 1px solid ${(props) => (props.hasError ? 'red' : '#d9d9d9')};
    padding: 5px 10px;
    margin: 0px 0px 0px 0px;
    resize: none;
    ${(props) => props.hasError && `background: #ffd1d1;`}
  }
  &.ant-input::placeholder {
    color: #7d7d7d;
  }
`

const StyledTitle = styled.text`
  font-family: Inter;
  color: black;
  font-size: 15px;
  font-weight: bold;
  line-height: 30px;
  margin-right: 20px;
  white-space: nowrap;
`

type InputRowProps = {
  title?: string
  placeholder: string
  value?: string
  setValue?: Dispatch<SetStateAction<string>> | ((input: string) => void)
  textarea?: boolean
  hasError?: boolean
  onChange?: () => void
}

export default function InputRow({ title, placeholder, value, setValue, textarea, onChange, hasError }: InputRowProps) {
  const Container = textarea ? Column : Row

  const [inputValue, setInputValue] = useState('')

  return (
    <Container>
      {title && <StyledTitle>{title}</StyledTitle>}
      {textarea ? (
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
