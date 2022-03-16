import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px 0px;
`

const StyledTextArea = styled.div<{ hasError?: boolean; isPlaceholder?: boolean }>`
  background: #f3f3f9;
  border-radius: 10px;
  border: 1px solid ${(props) => (props.hasError ? '#F37562' : '#f3f3f9')};
  padding: 5px 15px;
  text-align: ${(props) => (props.hasError ? 'left' : props.isPlaceholder ? 'middle' : 'left')};
  color: ${(props) => (props.hasError ? '#F37562' : props.isPlaceholder ? '#BFBFBF' : 'black')};
  height: 2rem;
`

const StyledTitle = styled.div`
  display: flex;
  font-family: Lato;
  color: black;
  font-size: 15px;
  line-height: 30px;
  font-weight: bold;
  white-space: nowrap;
  text-align: left;
`
const RedText = styled.div`
  color: #f37562;
  margin-left: 0.2rem;
`

type Props = {
  title: string
  value: string
  isCompulsory?: boolean
  error?: boolean
  onClick: () => void
}

function SelectableField(prop: Props) {
  return (
    <Container>
      <StyledTitle>
        {prop.title} {prop.isCompulsory ? <RedText>*</RedText> : null}
      </StyledTitle>
      <StyledTextArea
        hasError={prop.error}
        isPlaceholder={prop.isCompulsory && prop.value === ''}
        onClick={() => prop.onClick()}
      >
        {prop.error
          ? 'This is a required field'
          : prop.isCompulsory && prop.value === ''
          ? 'Choose a Date'
          : prop.value}
      </StyledTextArea>
    </Container>
  )
}

export default SelectableField
