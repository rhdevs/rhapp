import React from 'react'
import styled from 'styled-components'
import CloseIcon from '../../assets/CloseIcon.svg'

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  padding: 5px 10px;
  position: sticky;
  border-radius: 10px;
  max-width: 300px;
  boxshadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px rgba(0, 0, 0, 0.08),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);
`

const HeaderContainer = styled.div``

const TextContainer = styled.div`
  display: flex;
  flexdirection: column;
  padding: 10px;
`

const IconContainer = styled.div`
  padding: 0px 5px;
`

const SupperGroupName = styled.text`
  font-size: 14px;
  font-weight: bold;
`

const TitleContent = styled.text`
  font-size: 14px;
  font-weight: 300;
`
const SubHeader = styled.text`
  font-size: 13px;
  font-weight: 200;
`
const CloseButton = styled.img``

type Props = {
  supperGroupName: string
  onViewClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onCloseClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const NotificationBar = (props: Props) => {
  return (
    <>
      <MainContainer>
        <TextContainer onClick={props.onViewClick}>
          <HeaderContainer>
            <SupperGroupName>{props.supperGroupName}</SupperGroupName>
            <TitleContent> has been updated!</TitleContent>
          </HeaderContainer>
          <SubHeader>Tap to view.</SubHeader>
        </TextContainer>
        <IconContainer onClick={props.onCloseClick}>
          <CloseButton src={CloseIcon} alt="close symbol" />
        </IconContainer>
      </MainContainer>
    </>
  )
}
