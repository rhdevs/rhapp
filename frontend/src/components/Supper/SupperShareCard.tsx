import React, { useState } from 'react'

import styled from 'styled-components'
import { RhAppQrCode } from '../RhAppQrCode'
import { MainCard } from './MainCard'
import { CloseOutlined, CopyFilled } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../routes/Routes'
import { SGTelegramShareButton } from './SGTelegramShareButton'
import { CopyToClipboard } from 'react-copy-to-clipboard'

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
  height: 31px;
  border-radius: 2px;
  width: 100%;
  margin: 20px 30px 0 30px;
`

const LinkContainer = styled.div`
  padding: 0px 10px;
  align-items: center;
  overflow: hidden;
  width: 90%;
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

type Props = {
  supperGroupId: string
}

export const SupperShareCard = (props: Props) => {
  const history = useHistory()
  const link = `rhapp.lol${PATHS.JOIN_ORDER}/${props.supperGroupId}`

  const onCloseClick = () => {
    history.goBack()
  }

  return (
    <MainCard flexDirection="column" padding="25px 35px;" minHeight="340px;">
      <HeaderContainer>
        <HeaderText>Share supper group link</HeaderText>
        <CloseButton onClick={onCloseClick} />
      </HeaderContainer>
      <QRContainer>
        <RhAppQrCode link={link} />
        <QRLinkContainer>
          <LinkContainer>
            <LinkText>{link}</LinkText>
          </LinkContainer>
          <CopyToClipboard text={link}>
            <CopyButtonContainer>
              <CopyFilled />
            </CopyButtonContainer>
          </CopyToClipboard>
        </QRLinkContainer>
      </QRContainer>
      <ButtonContainer>
        <SGTelegramShareButton url={link} text={'Click the link to join the supper group!'} />
      </ButtonContainer>
    </MainCard>
  )
}
