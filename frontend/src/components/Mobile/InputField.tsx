import React from 'react'
import styled from 'styled-components'

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

const StyledInput = styled.input<{ hasError?: boolean }>`
  background: #f3f3f9;
  width: 100%;
  border-radius: 10px;
  border: 1px solid ${(props) => (props.hasError ? '#f37562' : '#f3f3f9')};
  padding: 5px 16px;
  margin: 0;
  height: 2rem;

  ::placeholder {
    color: ${(props) => (props.hasError ? '#f37562' : '#bfbfbf')};
  }
`

const StyledTextArea = styled.textarea<{ hasError?: boolean }>`
  background: #f3f3f9;
  width: 100%;
  border-radius: 10px;
  padding: 10px 16px;
  margin: 0;
  resize: none;
  border: 1px solid ${(props) => (props.hasError ? '#f37562' : '#f3f3f9')};

  ::placeholder {
    color: ${(props) => (props.hasError ? '#f37562' : '#bfbfbf')};
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
  value?: string
  placeholder?: string
  textArea?: boolean
  required?: boolean
  defaultValue?: string
  onChange?: (e: any) => void
}

export default function InputField(props: InputFieldProps) {
  const RedAsterisk = <RedText>*</RedText>
  const { title, value, placeholder, textArea, required, defaultValue, onChange } = props

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
          placeholder={placeholder}
          value={value}
          rows={5}
          onChange={onChange}
          // hasError={!!errors}
          defaultValue={defaultValue}
        />
      ) : (
        <StyledInput
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          // hasError={!!errors}
          defaultValue={defaultValue}
        />
      )}
    </Container>
  )
}

// errors ? `${title} is required` : placeholder
