import React from 'react'

import styled from 'styled-components'
import { RhAppQrCode } from '../../RhAppQrCode'
import { MainCard } from '../MainCard'
import { CloseOutlined, CopyFilled } from '@ant-design/icons'
import { PATHS } from '../../../routes/Routes'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import telegram_black from '../../../assets/telegram_black.svg'
import { teleShareWithText } from '../../../common/telegramMethods'
import useSnackbar from '../../../hooks/useSnackbar'

const OverlayBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
`

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
  display: flex;
`

const LinkText = styled.text`
  white-space: pre;
`

const CopyButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 5px;
  outline: 1px solid #d9d9d9;
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
  rawSupperGroupId: number | undefined
  teleShareModalSetter: React.Dispatch<React.SetStateAction<boolean>>
}

export const SupperShareModal = (props: Props) => {
  const link = `rhapp.lol${PATHS.JOIN_GROUP}/${props.rawSupperGroupId}`

  const onCloseClick = () => {
    props.teleShareModalSetter(false)
  }

  const onShareClick = () => {
    return teleShareWithText(link, 'Click the link to join the supper group!')
  }

  const copyText = `Join my supper group! ${link}`

  return (
    <OverlayBackground>
      <MainCard flexDirection="column" margin="80px 30px;" padding="25px 35px;" minHeight="340px;">
        <HeaderContainer>
          <HeaderText>Share supper group link</HeaderText>
          <CloseButton onClick={onCloseClick} />
        </HeaderContainer>
        <QRContainer>
          <RhAppQrCode link={link} />
          <QRLinkContainer>
            <LinkContainer>
              <LinkText>{copyText}</LinkText>
            </LinkContainer>
            <CopyToClipboard text={copyText}>
              <CopyButtonContainer
                onClick={() => {
                  const [success] = useSnackbar('success')
                  success('Supper Group link copied!')
                }}
              >
                <CopyFilled />
              </CopyButtonContainer>
            </CopyToClipboard>
          </QRLinkContainer>
        </QRContainer>
        <ButtonContainer>
          <Button src={telegram_black} alt="telegram share button" onClick={onShareClick} />
        </ButtonContainer>
      </MainCard>
    </OverlayBackground>
  )
}
