import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import { openUserTelegram } from '../../../common/telegramMethods'
import { PaymentInfo, PaymentMethod, SupperGroupStatus } from '../../../store/supper/types'
import Button from '../../Mobile/Button'
import locationIcon from '../../../assets/LocationIcon.svg'
import moneyIcon from '../../../assets/MoneyIcon.svg'
import { MainCard } from '../MainCard'
import { SGStatusBubble } from '../SGStatusBubble'
import { UnderlinedButton } from '../UnderlinedButton'
import { PATHS } from '../../../routes/Routes'
import { getUserOrder } from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import { Skeleton } from '../../Skeleton'

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
  margin: 0 20px 0 15px;
  width: 60%;
`

const TitleContainer = styled.text`
  font-size: 16px;
  font-weight: 600;
  line-height: 17px;
`

const OrderIdContainer = styled.text`
  font-size: 14px;
  line-height: 15px;
  font-weight: 200;
  padding-bottom: 4px;
`

const StatusContainer = styled.div<{ statusOnly?: boolean }>`
  margin: ${(props) => (props.statusOnly ? '0px' : '0px 20px 0 15px')};
  padding: ${(props) => (props.statusOnly ? '1px 0px' : '10px 0 12px ')};
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
  supperGroupStatus: SupperGroupStatus | undefined
  restaurantLogo: string | undefined
  supperGroupName: string | undefined
  rawSupperGroupId: number | undefined
  idHeader: string
  buttonTeleHandle: string | undefined
  location?: string | undefined
  collectionTime?: string
  paymentMethod?: PaymentInfo[] | undefined
  cancelReason?: string | undefined
  statusOnly: boolean | undefined
  margin?: string
  onCardClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const SGStatusCard = (props: Props) => {
  const isCancelled = props.supperGroupStatus === SupperGroupStatus.CANCELLED
  const isArrived =
    props.supperGroupStatus === SupperGroupStatus.ARRIVED ||
    props.supperGroupStatus === SupperGroupStatus.AWAITING_PAYMENT ||
    props.supperGroupStatus === SupperGroupStatus.ALL_PAID
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserOrder(props.rawSupperGroupId, localStorage.userID))
  }, [dispatch])

  const onClick = () => {
    if (props.buttonTeleHandle) {
      openUserTelegram(props.buttonTeleHandle)
    }
  }

  const { order, isLoading } = useSelector((state: RootState) => state.supper)

  const showPayingStatus = () => {
    if (isLoading) {
      return <Skeleton width="85px" height="26px" />
    }
    if (props.supperGroupStatus === SupperGroupStatus.AWAITING_PAYMENT) {
      if (props.isOwner) {
        return <SGStatusBubble roundVersion text={props.supperGroupStatus ?? '-'} />
      } else {
        if (order?.hasPaid) {
          return <SGStatusBubble roundVersion text={SupperGroupStatus.PAID} />
        } else {
          return <SGStatusBubble roundVersion text={SupperGroupStatus.NOT_PAID} />
        }
      }
    } else {
      return <SGStatusBubble roundVersion text={props.supperGroupStatus ?? '-'} />
    }
  }

  const showContentBody = () => {
    if (isArrived) {
      return (
        <>
          <StatusContainer>
            {isLoading ? <Skeleton width="90px" height="32px" /> : <SGStatusBubble text={SupperGroupStatus.ARRIVED} />}
            {!props.isOwner && (
              <Button
                stopPropagation={true}
                defaultButtonDescription="Message Owner"
                onButtonClick={props.buttonTeleHandle ? onClick : undefined}
                isFlipButton={false}
              />
            )}
          </StatusContainer>
          <OtherInfoContainer>
            <OtherInfoSubContainer>
              <IconImage src={locationIcon} alt="Location Icon" />
              <LocationText>
                {isLoading ? (
                  <Skeleton width="150px" height="14px" />
                ) : (
                  <>
                    {props.location} @ {props.collectionTime}
                  </>
                )}
              </LocationText>
            </OtherInfoSubContainer>
            <OtherInfoSubContainer>
              <IconImage src={moneyIcon} alt="Money Icon" />
              <PaymentTextContainer>
                {isLoading ? (
                  <Skeleton width="200px" height="12px" />
                ) : (
                  <>
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
                            onClick={() =>
                              window.open(link === null ? undefined : link, '_blank', 'noopener,noreferrer')
                            }
                            text={pm.paymentMethod}
                            color="rgba(0, 38, 66, 0.7)"
                          />
                        )
                      }
                    })}
                  </>
                )}
              </PaymentTextContainer>
            </OtherInfoSubContainer>
          </OtherInfoContainer>
        </>
      )
    } else if (isCancelled) {
      return (
        <>
          <StatusContainer>
            {isLoading ? (
              <Skeleton width="90px" height="32px" />
            ) : (
              <SGStatusBubble text={SupperGroupStatus.CANCELLED} />
            )}
            {!props.isOwner && (
              <Button
                stopPropagation={true}
                defaultButtonDescription="Message Owner"
                onButtonClick={props.buttonTeleHandle ? onClick : undefined}
                isFlipButton={false}
              />
            )}
          </StatusContainer>
          <ReasonText>
            Reason: {isLoading ? <Skeleton width="150px" height="14px" /> : <>{props.cancelReason ?? '-'}</>}
          </ReasonText>
        </>
      )
    } else {
      return (
        <StatusContainer>
          {isLoading ? (
            <Skeleton width="90px" height="32px" />
          ) : (
            <SGStatusBubble text={props.supperGroupStatus ?? ''} />
          )}
          {!props.isOwner && (
            <Button
              stopPropagation={true}
              defaultButtonDescription="Message Owner"
              onButtonClick={props.buttonTeleHandle ? onClick : undefined}
              isFlipButton={false}
            />
          )}
        </StatusContainer>
      )
    }
  }

  return (
    <MainCard onClick={props.onCardClick} margin={props.margin} flexDirection="column">
      <TopSection>
        {isLoading ? <Skeleton image /> : <RestaurantLogo src={props.restaurantLogo} alt="Restaurant Logo" />}
        <TextSubContainer>
          <OrderIdContainer>
            {isLoading ? <Skeleton height="14px" margin="5px 0 3px 0" /> : props.idHeader}
          </OrderIdContainer>
          <TitleContainer>
            {isLoading ? <Skeleton height="16px" width="140px" margin="0 0 5px 0" /> : props.supperGroupName}
          </TitleContainer>
          {props.statusOnly && <StatusContainer statusOnly={props.statusOnly}>{showPayingStatus()}</StatusContainer>}
        </TextSubContainer>
      </TopSection>
      <>
        {!props.statusOnly && (
          <>
            {showContentBody()}
            {!isCancelled && props.isOwner && (
              <OwnerButtonContainer>
                {isLoading ? (
                  <Skeleton width="150px" height="14px" />
                ) : (
                  <UnderlinedButton
                    onClick={() => history.push(`${PATHS.DELIVERY_DETAILS}/${props.rawSupperGroupId}/details`)}
                    text="Update Delivery Details"
                    color="red"
                    fontSize="14px"
                  />
                )}
              </OwnerButtonContainer>
            )}
          </>
        )}
      </>
    </MainCard>
  )
}
