import React, { ReactChild, ReactChildren } from 'react'
import styled from 'styled-components'

const MainContainer = styled.div<{ flexDirection?: string }>`
  position: relative;
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  padding: 15px;
  flex-direction: ${(props) => props.flexDirection ?? ''};
`

interface AuxProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[]
  flexDirection?: string
}

export const MainCard = (props: AuxProps) => {
  return <MainContainer flexDirection={props.flexDirection}>{props.children}</MainContainer>
}
