import React from 'react'

import styled from 'styled-components'
import { FoodLine } from './FoodLine'
import { MainCard } from './MainCard'
import { CloseOutlined, UserOutlined } from '@ant-design/icons'
import telegram_black from '../../assets/telegram_black.svg'
import { openUserTelegram } from '../../common/telegramMethods'
import { Food, Order } from '../../store/supper/types'
import { V1_RED } from '../../common/colours'
import { Skeleton } from '../Skeleton'

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
  margin: 0 5px;
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

const ContactCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 20px;
  align-items: flex-end;
`

const IdentityContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
`

const IdentitySymbol = styled(UserOutlined)`
  font-size: 25px;
`

const NameContainer = styled.div`
  padding: 0 10px;
  display: flex;
  align-items: center;
`

const Name = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 14px;
`
const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px;
`

const EmptyContact = styled.text`
  font-size: 15px;
  font-weight: 400;
`

const ButtonContainer = styled.div``

const Button = styled.img`
  width: 25px;
`

type Prop = {
  orderList: Order[]
  foodList: Food[]
  foodId: string
  contactModalSetter: React.Dispatch<React.SetStateAction<boolean>>
}

export const ContactModal = (props: Prop) => {
  const filteredFoodList = props.foodList.find((food) => food.foodId === props.foodId)
  const contacts = filteredFoodList?.userIdList
  let userDetails: string[][] | undefined

  contacts?.map((userId) => {
    let detail: string[] = []
    props.orderList
      .filter((order) => order.user.userID === userId)
      .map((order) => {
        detail = [userId, order.user.displayName, order.user.telegramHandle]
        userDetails?.push(detail)
      })
  })

  const onCloseClick = () => {
    props.contactModalSetter(false)
  }

  return (
    <OverlayBackground>
      <MainCard flexDirection="column" margin="100px 30px" padding="20px 25px" minHeight="300px">
        <HeaderContainer>
          <HeaderText>Contact Users</HeaderText>
          <CloseButton onClick={onCloseClick} />
        </HeaderContainer>
        <FoodLine
          backgroundColor="#EEEEEE"
          food={filteredFoodList}
          borderRadius="10px"
          padding="10px"
          margin="10px 0"
          hasNoQuantity
        />
        <ContactsContainer>
          {userDetails ? (
            userDetails.map((userDetail) => {
              const index = userDetail[0]
              const name = userDetail[1]
              const tele = userDetail[2]
              return (
                <ContactCard key={index}>
                  <IdentityContainer>
                    <IdentitySymbol />
                    <NameContainer>
                      <Name>{name}</Name>
                    </NameContainer>
                  </IdentityContainer>
                  <ButtonContainer>
                    <Button
                      src={telegram_black}
                      alt="telegram share button"
                      onClick={() => {
                        openUserTelegram(tele)
                      }}
                    />
                  </ButtonContainer>
                </ContactCard>
              )
            })
          ) : (
            <EmptyContainer>
              <EmptyContact>No contact available</EmptyContact>
            </EmptyContainer>
          )}
        </ContactsContainer>
      </MainCard>
    </OverlayBackground>
  )
}
