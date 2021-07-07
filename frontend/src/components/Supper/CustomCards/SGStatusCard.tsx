import React from 'react'

import styled from 'styled-components'
import { openUserTelegram } from '../../../common/telegramMethods'
import { PaymentInfo, PaymentMethod, SupperGroupStatus } from '../../../store/supper/types'
import Button from '../../Mobile/Button'
import locationIcon from '../../../assets/LocationIcon.svg'
import moneyIcon from '../../../assets/MoneyIcon.svg'
import { MainCard } from '../MainCard'
import { SGStatusBubble } from '../SGStatusBubble'
import { UnderlinedButton } from '../UnderlinedButton'

const TopSection = styled.div`
  display: flex;
  flex-direction: row;
`

const RestaurantLogo = styled.img`
  margin: auto;
  display: flex;
  justify-content: center;
  border-radius: 10px;
  height: 80px;
  width: 80px;
`

const TextSubContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 8px 20px 0 15px;
  width: 60%;
`

const TitleContainer = styled.text`
  font-size: 16px;
  font-weight: 600;
  line-height: 17px;
`

const OrderIdContainer = styled.text`
  font-size: 14px;
  font-weight: 200;
`

const StatusContainer = styled.div<{ statusOnly?: boolean }>`
  margin: ${(props) => (props.statusOnly ? '0px' : '8px 20px 0 15px')};
  padding: ${(props) => (props.statusOnly ? '1px 0px' : '10px 0 12px')};
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => (props.statusOnly ? 'flex-start' : 'space-evenly')};
  align-items: center;
`

const ReasonText = styled.text`
  font-weight: 200;
  font-size: 14px;
  margin: auto;
  padding-top: 5px;
`

const OtherInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const OtherInfoSubContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 80%;
  margin: auto;
`

const IconImage = styled.img`
  width: 12px;
  margin: 5px;
`

const LocationText = styled.text`
  font-size: 14px;
  margin: 0 5px;
`

const PaymentTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`

const CashText = styled.text`
  margin: 0 5px;
  font-size: 12px;
  color: rgba(0, 38, 66, 0.7);
`

const OwnerButtonContainer = styled.div`
  margin: auto;
  padding-top: 3px;
`

type Props = {
  isOwner?: boolean
  supperGroupStatus?: SupperGroupStatus | undefined
  restaurantLogo: string | undefined // change to compulsory
  title: string | undefined
  orderId: string
  username: string
  buttonTeleHandle: string | undefined
  location?: string | undefined
  collectionTime?: string
  paymentMethod?: PaymentInfo[] | undefined
  cancelReason?: string | undefined
  statusOnly?: boolean | undefined
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const SGStatusCard = (props: Props) => {
  const IsCancelled = props.supperGroupStatus === SupperGroupStatus.CANCELLED
  const IsArrived = props.supperGroupStatus === SupperGroupStatus.ARRIVED
  const IsOrdered = props.supperGroupStatus === SupperGroupStatus.ORDERED
  const IsNotOpen = IsCancelled || IsArrived || IsOrdered
  const showStatusOnly = props.statusOnly ?? false

  const onClick = () => {
    {
      props.buttonTeleHandle && openUserTelegram(props.buttonTeleHandle)
    }
    return undefined
  }

  return (
    <MainCard flexDirection="column">
      <TopSection>
        <RestaurantLogo src={props.restaurantLogo} alt="Restaurant Logo" />
        <TextSubContainer>
          <OrderIdContainer>
            {props.orderId} ({props.isOwner ? 'You' : props.username})
          </OrderIdContainer>
          <TitleContainer>{props.title}</TitleContainer>
          {showStatusOnly ? (
            <StatusContainer statusOnly={showStatusOnly}>
              <SGStatusBubble roundversion margin="5px 0" borderRadius="30px" text={props.supperGroupStatus ?? '-'} />
            </StatusContainer>
          ) : (
            <></>
          )}
        </TextSubContainer>
      </TopSection>
      {!showStatusOnly && IsNotOpen ? (
        <>
          <StatusContainer>
            <SGStatusBubble text={props.supperGroupStatus ?? '-'} />
            {!props.isOwner && (
              <Button
                stopPropagation={true}
                defaultButtonDescription="Message Owner"
                onButtonClick={props.buttonTeleHandle ? onClick : undefined}
                isFlipButton={false}
              />
            )}
          </StatusContainer>
          {IsCancelled ? (
            <ReasonText>Reason: {props.cancelReason ?? '-'}</ReasonText>
          ) : IsArrived ? (
            <OtherInfoContainer>
              <OtherInfoSubContainer>
                <IconImage src={locationIcon} alt="Location Icon" />
                <LocationText>
                  {props.location} @ {props.collectionTime}
                </LocationText>
              </OtherInfoSubContainer>
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
                          fontSize="12px"
                          margin="0 3px"
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
            </OtherInfoContainer>
          ) : (
            <></>
          )}
          {!IsCancelled && props.isOwner ? (
            <OwnerButtonContainer>
              <UnderlinedButton
                onClick={(e) => props.onClick && props.onClick(e)}
                text="Update Order Details"
                color="red"
                fontSize="14px"
              />
            </OwnerButtonContainer>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </MainCard>
  )
}
