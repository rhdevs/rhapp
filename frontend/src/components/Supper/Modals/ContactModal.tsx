import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { FoodLine } from '../FoodLine'
import { MainCard } from '../MainCard'
import CloseOutlined from '@ant-design/icons/lib/icons/CloseOutlined'
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined'
import { Food, Order, UserDetails } from '../../../store/supper/types'
import { TelegramShareButton } from '../../TelegramShareButton'
import { V1_GREY_BACKGROUND } from '../../../common/colours'

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

const HeaderText = styled.p`
  margin: 0;
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
  align-items: center;
`

const IdentityContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
`

const IdentitySymbol = styled(UserOutlined)`
  font-size: 20px;
  margin: auto 0;
`

const NameContainer = styled.div`
  padding: 0 10px;
  display: flex;
  align-items: center;
`

const Name = styled.p`
  margin: 0;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
`

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px;
`

const EmptyContact = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 400;
`

const ButtonContainer = styled.div``

type Prop = {
  orderList: Order[] | undefined
  food: Food | undefined
  supperGroupId: number | undefined
  orderId: string | undefined
  contactModalSetter: React.Dispatch<React.SetStateAction<boolean>>
}

export const ContactModal = (props: Prop) => {
  const [userDetails, setUserDetails] = useState<UserDetails[]>([])

  useEffect(() => {
    const contacts = props.food?.userIdList
    const userdetails = contacts
      ?.map((userId) => {
        const userInfo = props.orderList?.find((order) => order.user.userID === userId)?.user
        if (userInfo) {
          const indivUserDetail: UserDetails = {
            userId: userInfo.userID,
            name: userInfo.displayName,
            telegramHandle: userInfo.telegramHandle,
          }
          return indivUserDetail
        } else return {} as UserDetails
      })
      ?.filter((k) => k.name !== undefined)
    setUserDetails(userdetails ?? [])
  }, [props.orderList, props.food])

  const onCloseClick = () => {
    props.contactModalSetter(false)
  }

  return (
    <OverlayBackground>
      <MainCard flexDirection="column" margin="100px 30px" padding="20px 25px" minHeight="fit-content">
        <HeaderContainer>
          <HeaderText>Contact Users</HeaderText>
          <CloseButton onClick={onCloseClick} />
        </HeaderContainer>
        <FoodLine
          backgroundColor={V1_GREY_BACKGROUND}
          food={props.food}
          supperGroupId={props.supperGroupId}
          orderId={props.orderId}
          borderRadius="10px"
          padding="10px"
          margin="10px 0"
          hasNoQuantity
        />
        <ContactsContainer>
          {userDetails.length ? (
            userDetails.map((userDetail: UserDetails) => {
              const isOwner = userDetail.userId === localStorage.userID
              return (
                <ContactCard key={userDetail.userId}>
                  <IdentityContainer>
                    <IdentitySymbol />
                    <NameContainer>
                      <Name>{isOwner ? 'You' : userDetail.name}</Name>
                    </NameContainer>
                  </IdentityContainer>
                  {!isOwner && (
                    <ButtonContainer>
                      <TelegramShareButton telegramHandle={userDetail.telegramHandle} size="26px" />
                    </ButtonContainer>
                  )}
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
