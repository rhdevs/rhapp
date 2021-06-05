import React from 'react'

import styled from 'styled-components'
import { MainCard } from '../MainCard'
import locationIcon from '../../../assets/LocationIcon.svg'
import moneyIcon from '../../../assets/MoneyIcon.svg'
import { SGStatusBubble } from '../SGStatusBubble'
import { PaymentInfo, PaymentMethod, Restaurants, SupperGroupStatus } from '../../../store/supper/types'
import Button from '../../Mobile/Button'
import { OpenUserTelegram } from '../../TelegramShareButton'
import { UnderlinedButton } from '../UnderlinedButton'
import { RoundImage } from '../RoundImage'
import { getRestaurantLogo } from '../../../common/getRestaurantLogo'

const BottomContainer = styled.div`
  margin: 8px 20px 0 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`

const ReasonText = styled.text`
  font-weight: 200;
  font-size: 14px;
  margin: auto;
  padding-top: 5px;
`

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
`

const TextSubContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 20px 0 15px;
  width: 60%;
`

const TitleContainer = styled.text`
  font-size: 20px;
  font-weight: 600;
`

const OrderIdContainer = styled.text`
  font-size: 14px;
  font-weight: 200;
`

const OtherInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const IconImage = styled.img`
  width: 21px;
  margin: 5px;
`

const OtherInfoSubContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  width: 90%;
  margin: auto;
`

const LocationText = styled.text`
  font-size: 16px;
  margin: 0 5px;
`

const CashText = styled.text`
  margin: 0 5px;
  font-size: 16px;
  color: rgba(0, 38, 66, 0.7);
`

const PaymentTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`

const OwnerButtonContainer = styled.div`
  margin: auto;
  padding-top: 3px;
`

type Props = {
  title: string
  restaurantLogo?: string
  restaurant?: Restaurants
  orderId: string
  username: string
  supperGroupStatus?: SupperGroupStatus
  buttonTeleHandle?: string
  location?: string
  collectionTime?: string
  paymentMethod?: PaymentInfo[]
  isOwner?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  cancelReason?: string
}

export const SGCardWithStatus = (props: Props) => {
  const onClick = () => {
    {
      props.buttonTeleHandle && OpenUserTelegram(props.buttonTeleHandle)
    }
    return undefined
  }

  const isCancelledCard = props.supperGroupStatus === SupperGroupStatus.CANCELLED

  return (
    <MainCard flexDirection="column">
      <TopSection>
        <RoundImage image={getRestaurantLogo(props.restaurant)} alt="Restaurant Logo" />
        <TextSubContainer>
          <TitleContainer>{props.title}</TitleContainer>
          <OrderIdContainer>
            {props.orderId} ({props.isOwner ? 'You' : props.username})
          </OrderIdContainer>
        </TextSubContainer>
      </TopSection>
      <BottomContainer>
        <SGStatusBubble text={props.supperGroupStatus ?? '-'} />
        {!props.isOwner && (
          <Button
            stopPropagation={true}
            defaultButtonDescription="Message Owner"
            onButtonClick={props.buttonTeleHandle ? onClick : undefined}
            isFlipButton={false}
          />
        )}
      </BottomContainer>
      {isCancelledCard ? (
        <ReasonText>Reason: {props.cancelReason ?? '-'}</ReasonText>
      ) : (
        <OtherInfoContainer>
          <OtherInfoSubContainer>
            <IconImage src={locationIcon} alt="Location Icon" />
            <LocationText>
              {props.location} @ {props.collectionTime}
            </LocationText>
          </OtherInfoSubContainer>
          {!props.isOwner && (
            <OtherInfoSubContainer>
              <IconImage src={moneyIcon} alt="Money Icon" />
              <PaymentTextContainer>
                {props.paymentMethod?.map((pm, index) => {
                  if (pm.paymentMethod === PaymentMethod.CASH) {
                    return <CashText key={index}>{pm.paymentMethod}</CashText>
                  } else {
                    let link = pm.link
                    if (!(pm.link?.includes('https://') || pm.link?.includes('http://'))) {
                      link = 'https://' + pm.link
                    }
                    return (
                      <UnderlinedButton
                        fontSize="16px"
                        key={index}
                        onClick={() => window.open(link === null ? undefined : link, '_blank', 'noopener,noreferrer')}
                        text={pm.paymentMethod}
                        color="rgba(0, 38, 66, 0.7)"
                      />
                    )
                  }
                })}
              </PaymentTextContainer>
            </OtherInfoSubContainer>
          )}
        </OtherInfoContainer>
      )}
      {props.isOwner ? (
        <OwnerButtonContainer>
          <UnderlinedButton onClick={props.onClick} text="Update Order Details" color="red" fontSize="14px" />
        </OwnerButtonContainer>
      ) : (
        <></>
      )}
    </MainCard>
  )
}
