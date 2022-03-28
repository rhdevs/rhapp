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

const StyledInput = styled(Input)<{ haserror?: boolean }>`
  &.ant-input {
    width: 100%;
    border-radius: 30px;
    border: 1px solid ${(props) => (props.haserror ? 'red' : '#d9d9d9')};
    padding: 5px 10px;
    margin: 0px 0px 0px 0px;
    ${(props) => props.haserror && `background: #ffd1d1;`}
  }
  &.ant-input::placeholder {
    color: #7d7d7d;
  }
`

const { TextArea } = Input
const StyledTextArea = styled(TextArea)<{ haserror?: boolean }>`
  &.ant-input {
    width: 100%;
    border-radius: 15px;
    border: 1px solid ${(props) => (props.haserror ? 'red' : '#d9d9d9')};
    padding: 5px 10px;
    margin: 0px 0px 0px 0px;
    resize: none;
    ${(props) => props.haserror && `background: #ffd1d1;`}
  }
  &.ant-input::placeholder {
    color: #7d7d7d;
  }
`

const StyledTitle = styled.p`
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
  haserror?: boolean
  onChange?: () => void
}

export default function InputRow({ title, placeholder, value, setValue, textarea, onChange, haserror }: InputRowProps) {
  const Container = textarea ? Column : Row

  const [inputValue, setInputValue] = useState('')

  return (
    <Container>
      {title && <StyledTitle>{title}</StyledTitle>}
      {textarea ? (
        <StyledTextArea
          haserror={haserror}
          placeholder={placeholder}
          value={value ?? inputValue}
          onChange={onChange ?? ((e) => (setValue ? setValue(e.target.value) : setInputValue(e.target.value)))}
          rows={4}
        />
      ) : (
        <StyledInput
          haserror={haserror}
          placeholder={placeholder}
          value={value ?? inputValue}
          onChange={onChange ?? ((e) => (setValue ? setValue(e.target.value) : setInputValue(e.target.value)))}
        />
      )}
    </Container>
  )
}
