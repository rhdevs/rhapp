import React from 'react'
import styled from 'styled-components'
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

const StyledInput = styled(Input)<{ hasError?: boolean }>`
  &.ant-input {
    background: #f3f3f9;
    width: 100%;
    border-radius: 10px;
    border: 1px solid ${(props) => (props.hasError ? '#f37562' : '#f3f3f9')};
    padding: 5px 15px;
    margin: 0;
  }
  &.ant-input::placeholder {
    color: ${(props) => (props.hasError ? '#f37562' : '#bfbfbf')};
    font-size: 0.8rem;
  }
`

const { TextArea } = Input
const StyledTextArea = styled(TextArea)<{ hasError?: boolean }>`
  &.ant-input {
    background: #f3f3f9;
    width: 100%;
    border-radius: 10px;
    padding: 5px 15px;
    margin: 0;
    resize: none;
    border: 1px solid ${(props) => (props.hasError ? '#f37562' : '#f3f3f9')};
  }
  &.ant-input::placeholder {
    color: ${(props) => (props.hasError ? '#f37562' : '#bfbfbf')};
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
  name: string
  title: string
  placeholder: string
  textArea?: boolean
  required?: boolean
  hasError?: boolean
  onChange: () => void
}

export default function InputField(props: InputFieldProps) {
  const RedAsterisk = <RedText>*</RedText>
  const { title, placeholder, textArea, required, onChange, hasError } = props

  return (
    <Container>
      {title && (
        <StyledTitle>
          {title}
          {required && RedAsterisk}
        </StyledTitle>
      )}
      {textArea ? (
        <StyledTextArea
          placeholder={hasError ? `${title} is required` : placeholder}
          rows={4}
          onChange={onChange}
          hasError={hasError}
        />
      ) : (
        <StyledInput
          placeholder={hasError ? `${title} is required` : placeholder}
          onChange={onChange}
          hasError={hasError}
        />
      )}
    </Container>
  )
}
