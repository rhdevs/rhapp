import React from 'react'

import styled from 'styled-components'
import { RhAppQrCode } from '../RhAppQrCode'
import { MainCard } from './MainCard'
import { CloseOutlined, CopyFilled } from '@ant-design/icons'
import telegram_black from '../../assets/telegram_black.svg'
import { useHistory } from 'react-router-dom'

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const HeaderText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
`

const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`

const CloseButton = styled(CloseOutlined)`
  font-size: 21px;
`

const QRLinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  height: 31px;
  border-radius: 2px;
  width: 100%;
  margin: 20px 30px 0 30px;
`

const LinkContainer = styled.div`
  padding: 0px 10px;
  align-items: center;
`

const LinkText = styled.text``

const CopyButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 5px;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Button = styled.img`
  width: 40px;
`

type Props = {
  header: string
  copyLink: string
  qrLink: string
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  copyOnClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const ShareCard = (props: Props) => {
  const history = useHistory()

  const onCloseClick = () => {
    history.goBack()
  }

  return (
    <MainCard flexDirection="column" padding="25px 35px;" minHeight="340px;">
      <HeaderContainer>
        <HeaderText>{props.header}</HeaderText>
        <CloseButton onClick={onCloseClick} />
      </HeaderContainer>
      <QRContainer>
        <RhAppQrCode link={props.qrLink} />
        <QRLinkContainer>
          <LinkContainer>
            <LinkText>{props.copyLink}</LinkText>
          </LinkContainer>
          <CopyButtonContainer>
            <CopyFilled onClick={props.copyOnClick} />
          </CopyButtonContainer>
        </QRLinkContainer>
      </QRContainer>
      <ButtonContainer>
        <Button src={telegram_black} alt="tele button" onClick={props.onClick} />
      </ButtonContainer>
    </MainCard>
  )
}
