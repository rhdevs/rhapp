import { CloseOutlined, CopyFilled } from '@ant-design/icons'
import React from 'react'

import styled from 'styled-components'
import { RhAppQrCode } from '../RhAppQrCode'
import { MainCard } from './MainCard'

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
  margin: 30px 0px;
`

const QRCode = styled(CloseOutlined)`
  font-size: 21px;
`

const QRLinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  height: 31px;
  border-radius: 2px;
`

const LinkContainer = styled.input``

const CopyButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0px 5px;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
`

const ButtonContainer = styled.img``

type Props = {
  telelink: string | undefined
}

export const ShareCard = (props: Props) => {
  return (
    <MainCard flexDirection="column" padding="25px 35px;" minHeight="340px;">
      <HeaderContainer>
        <HeaderText>Share supper group link</HeaderText>
        <QRCode />
      </HeaderContainer>
      <QRContainer>
        <RhAppQrCode link="google.com" />
        <QRLinkContainer>
          <LinkContainer>{props.telelink}</LinkContainer>
          <CopyButtonContainer>
            <CopyFilled />
          </CopyButtonContainer>
        </QRLinkContainer>
      </QRContainer>
      <ButtonContainer src={'../../assets/telegram_black.svg'} alt="tele button" />
    </MainCard>
  )
}
