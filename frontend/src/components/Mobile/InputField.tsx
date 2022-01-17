import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'

import { Input } from 'antd'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px 0px;
`

const StyledInput = styled(Input)<{ haserror?: boolean }>`
  &.ant-input {
    background: #f3f3f9;
    width: 100%;
    border-radius: 30px;
    border: 1px solid ${(props) => (props.haserror ? 'red' : '#f3f3f9')};
    padding: 5px 10px;
    margin: 0px 0px 0px 0px;
    ${(props) => props.haserror && `background: #ffd1d1;`}
  }
  &.ant-input::placeholder {
    color: #bfbfbf;
    font-size: 0.8rem;
    padding-left: 5px;
  }
`

const { TextArea } = Input
const StyledTextArea = styled(TextArea)<{ haserror?: boolean }>`
  &.ant-input {
    background: #f3f3f9;
    width: 100%;
    border-radius: 20px;
    border: 1px solid ${(props) => (props.haserror ? 'red' : '#f3f3f9')};
    padding: 5px 10px;
    margin: 0px 0px 0px 0px;
    resize: none;
    ${(props) => props.haserror && `background: #ffd1d1;`}
  }
  &.ant-input::placeholder {
    color: #bfbfbf;
    padding: 4px;
    font-size: 0.8rem;
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
  haserror?: boolean
  onChange?: () => void
}

export default function InputRow({ title, placeholder, value, setValue, textarea, onChange, haserror }: InputRowProps) {
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
