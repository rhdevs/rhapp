import React, { Dispatch, SetStateAction } from 'react'
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

const StyledInput = styled(Input)`
  &.ant-input {
    width: 100%;
    border-radius: 30px;
    border: 1px solid #d9d9d9;
    padding: 5px 10px;
    margin: 0px 0px 0px 0px;
  }
  &.ant-input::placeholder {
    color: #d9d9d9;
  }
`

const { TextArea } = Input
const StyledTextArea = styled(TextArea)`
  &.ant-input {
    width: 100%;
    border-radius: 15px;
    border: 1px solid #d9d9d9;
    padding: 5px 10px;
    margin: 0px 0px 0px 0px;
    resize: none;
  }
  &.ant-input::placeholder {
    color: #d9d9d9;
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
  title: string
  placeholder: string
  value: string
  setValue: Dispatch<SetStateAction<string>>
  textarea?: boolean
}

export default function InputRow({ title, placeholder, value, setValue, textarea }: InputRowProps) {
  const Container = textarea ? Column : Row

  return (
    <Container>
      <StyledTitle>{title}</StyledTitle>
      {textarea ? (
        <StyledTextArea placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} rows={4} />
      ) : (
        <StyledInput placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} />
      )}
    </Container>
  )
}
