import React, { ReactChild, ReactChildren } from 'react'
import styled from 'styled-components'

const MainContainer = styled.div`
  position: relative;
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  padding: 15px;
`

interface AuxProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[]
}

export const MainCard = (props: AuxProps) => {
  return <MainContainer>{props.children}</MainContainer>
}
