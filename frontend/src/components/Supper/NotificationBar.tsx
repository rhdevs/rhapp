import React from 'react'
import styled from 'styled-components'

const MainContainer = styled.div``

const HeaderContainer = styled.div``

const SupperGroupName = styled.text`
  font-size: 14px;
  font-weight: bold;
`

const TitleContent = styled.text`
  font-size: 14px;
  font-weight: 300;
`

const TextContainer = styled.text`
  font-size: 13px;
  font-weight: 200;
`

type Props = {
  supperGroupName: string
}
export const NotificationBar = (props: Props) => {
  return (
    <>
      <MainContainer>
        <HeaderContainer>
          <SupperGroupName>{props.supperGroupName}</SupperGroupName>
          <TitleContent>has been updated!</TitleContent>
        </HeaderContainer>
        <TextContainer>Tap to view.</TextContainer>
      </MainContainer>
    </>
  )
}
