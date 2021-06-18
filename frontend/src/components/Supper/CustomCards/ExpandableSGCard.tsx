import React, { useEffect } from 'react'

import styled from 'styled-components'
import editIcon from '../../../assets/SupperEditIcon.svg'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import { MainCard } from '../MainCard'
import { RoundProgress } from '../RoundProgress'
import { StatusSymbol } from '../StatusSymbol'
import { UnderlinedButton } from '../UnderlinedButton'
import { useDispatch, useSelector } from 'react-redux'
import { setExpandableCardStatus } from '../../../store/supper/action'
import { RootState } from '../../../store/types'

const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: auto 0;
  position: relative;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 5px;
`

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const RightContainer = styled.div`
  padding: 0 7px;
`

const TitleText = styled.text`
  font-weight: 600;
  font-size: 17px;
`

const OrderText = styled.text`
  font-weight: 300;
  font-size: 12px;
`

const ExpandableButtonContainer = styled.div`
  padding-top: 10px;
  left: 15%;
  display: flex;
  align-items: center;
`

const EditIcon = styled.img`
  margin: 0 15px;
  right: 0;
  height: 15px;
`

type Props = {
  supperGroupName: string
  supperGroupId: string | number
  ownerName: string
  priceLimit: number
  currentAmount: number
  closingTime: string
  numberOfUsers: number
  deliveryFee: string
  isOwner?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  editOnClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const ExpandableSGCard = (props: Props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setExpandableCardStatus(false))
  }, [])

  const { isExpanded } = useSelector((state: RootState) => state.supper)

  const buttonText = isExpanded ? 'Hide Details' : 'Show Details'
  const arrowIcon = isExpanded ? <CaretUpOutlined /> : <CaretDownOutlined />
  return (
    <MainCard flexDirection="column">
      <TopContainer>
        <LeftContainer>
          <TitleText>{props.supperGroupName}</TitleText>
          <OrderText>
            {props.supperGroupId} ({props.isOwner ? 'You' : props.ownerName})
          </OrderText>
          <ExpandableButtonContainer>
            <UnderlinedButton
              onClick={() => {
                dispatch(setExpandableCardStatus(!isExpanded))
              }}
              fontSize="13px"
              text={buttonText}
              rightIcon={arrowIcon}
            />
            {props.isOwner && (
              <EditIcon
                onClick={props.editOnClick as React.MouseEventHandler<HTMLImageElement>}
                src={editIcon}
                alt="Edit Icon"
              />
            )}
          </ExpandableButtonContainer>
        </LeftContainer>
        <RightContainer>
          <RoundProgress
            priceLimit={props.priceLimit ? Number(props.priceLimit.toFixed(2)) : undefined}
            currentAmount={Number(props.currentAmount.toFixed(2))}
          />
        </RightContainer>
      </TopContainer>
      {isExpanded ? (
        <BottomContainer>
          <StatusSymbol text={props.closingTime} />
          <StatusSymbol type="numberOfUsers" text={String(props.numberOfUsers)} />
          <StatusSymbol type="deliveryFee" text={props.deliveryFee} />
        </BottomContainer>
      ) : (
        <></>
      )}
    </MainCard>
  )
}
