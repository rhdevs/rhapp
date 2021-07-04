import React from 'react'

import styled from 'styled-components'
import { foodList } from '../../store/stubs'
import { FoodLine } from './FoodLine'
import { MainCard } from './MainCard'
import { CloseOutlined, UserOutlined } from '@ant-design/icons'
import telegram_black from '../../assets/telegram_black.svg'
import { openUserTelegram } from '../../common/telegramMethods'

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

const CloseButton = styled(CloseOutlined)`
  font-size: 21px;
`

const ContactsContainer = styled.div``

const IdentityContainer = styled.div``

const NameContainer = styled.div``

const Name = styled.text``

const Button = styled.img`
  width: 40px;
`

type Prop = {
  contactModalSetter: React.Dispatch<React.SetStateAction<boolean>>
}

export const ContactModal = (props: Prop) => {
  const onCloseClick = () => {
    props.contactModalSetter(false)
  }

  const onContactClick = () => {
    return openUserTelegram('v')
  }

  return (
    <OverlayBackground>
      <MainCard flexDirection="column" margin="80px 30px;" padding="25px 35px;" minHeight="340px;">
        <HeaderContainer>
          <HeaderText>Contact Users</HeaderText>
          <CloseButton onClick={onCloseClick} />
        </HeaderContainer>
        <FoodLine backgroundColor="#EEEEEE" food={foodList[0]} hasNoQuantity />
        <ContactsContainer>
          <IdentityContainer>
            <UserOutlined />
            <NameContainer>
              <Name>Gou Gou</Name>
            </NameContainer>
          </IdentityContainer>
          <Button src={telegram_black} alt="telegram share button" onClick={onContactClick} />
        </ContactsContainer>
      </MainCard>
    </OverlayBackground>
  )
}
