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

const StyledTitle = styled.text`
  font-family: Inter;
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
  haserror?: boolean
  onChange?: () => void
}

export default function InputField({ title, placeholder, value, setValue, onChange, haserror }: InputFieldProps) {
  const [inputValue, setInputValue] = useState('')

  return (
    <Container>
      {title && <StyledTitle>{title}</StyledTitle>}
      <StyledInput
        haserror={haserror}
        placeholder={placeholder}
        value={value ?? inputValue}
        onChange={onChange ?? ((e) => (setValue ? setValue(e.target.value) : setInputValue(e.target.value)))}
      />
    </Container>
  )
}
