import React from 'react'

import styled from 'styled-components'
import { getRestaurantLogo } from '../../common/getRestaurantLogo'
import { Restaurants, SplitACMethod, SupperGroup } from '../../store/supper/types'
import { MainCard } from './MainCard'
import { Progress, Skeleton } from 'antd'
import { getReadableSupperGroupId, unixTo12HourTime } from '../../store/supper/action'
import { V1_RED } from '../../common/colours'
import { CarOutlined, FieldTimeOutlined, UserOutlined } from '@ant-design/icons'
import useSnackbar from '../../hooks/useSnackbar'

const LeftContainer = styled.div`
  flex: 30%;
  display: flex;
  justify-content: center;
  padding-right: 10px;
  margin: auto;
`
const RestaurantLogo = styled.img`
  margin: auto;
  display: flex;
  justify-content: center;
  border-radius: 10px;
  height: 80px;
  width: 80px;
`

const RightContainer = styled.div`
  flex: 80%;
  display: flex;
  flex-direction: column;
  margin: auto 0;
`

const StyledGroupIdText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
`

const StyledGroupNameText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
`

const GroupInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
`

const InfoSubContainer = styled.div<{ color?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 10px 0 0;
  ${(props) => props.color && `color: ${props.color};`}
`

const GroupCostInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-family: Inter;
  font-style: normal;
  font-weight: 300;
  font-size: 10px;
  align-items: center;
`

const StyledProgessBar = styled(Progress)`
  width: 100px;
  margin: 0 10px 0 0;
`

const StyledSkeleton = styled(Skeleton)<{ width?: string; height?: string; borderRadius?: string }>`
  width: ${(props) => props.width ?? '100px'};
  &.ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-title,
  .ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-paragraph > li {
    height: ${(props) => props.height ?? '12px'};
    margin: 5px 0;
    ${(props) => props.borderRadius && `border-radius: ${props.borderRadius};`}
  }
`

type Props = {
  supperGroup?: SupperGroup | undefined
  restaurantName?: string | undefined
  supperGroupId?: number | undefined
  ownerId?: string
  ownerName?: string
  supperGroupName?: string
  closingTime?: number | undefined
  additionalCost?: number
  splitAdditionalCost?: SplitACMethod | undefined
  costLimit?: number | undefined
  currentFoodCost?: number
  numOrders?: number
}

export const SupperGroupCard = (props: Props) => {
  const isLoading =
    props.supperGroup ??
    (props.ownerId &&
      props.ownerName &&
      props.supperGroupName &&
      props.additionalCost &&
      props.currentFoodCost &&
      props.numOrders)
      ? false
      : true

  setTimeout(() => {
    // if details still dont show after 20s, show error
    if (isLoading) {
      const [error] = useSnackbar('error')
      //TODO: Check if we should update to another error message
      error("Oh no! something went wrong.. we can't find the supper group :(")
    }
  }, 20000)

  const iconStyle = {
    color: 'rgba(0, 0, 0, 0.65)',
    paddingRight: '5px',
  } // For time, car and user

  const restaurantLogo = getRestaurantLogo((props.restaurantName ?? props.supperGroup?.restaurantName) as Restaurants)
  const supperGroupId = getReadableSupperGroupId(props.supperGroupId ?? props.supperGroup?.supperGroupId)
  const ownerName = `(${
    (props.ownerId ?? props.supperGroup?.ownerId) === localStorage.userID
      ? 'You'
      : props.ownerName ?? props.supperGroup?.ownerName ?? '-'
  })`
  const idText = `${supperGroupId} ${ownerName}`
  const supperGroupName = props.supperGroupName ?? props.supperGroup?.supperGroupName
  const closingTime = unixTo12HourTime(props.closingTime ?? props.supperGroup?.closingTime)
  const numberOfUsers = props.numOrders ?? props.supperGroup?.numOrders ?? 1 // To include owner
  const deliveryCost = `$${(props.additionalCost ?? props.supperGroup?.additionalCost ?? 0).toFixed(2)}`
  const splitMethod = props.splitAdditionalCost ?? props.supperGroup?.splitAdditionalCost
  let splitMethodIcon

  if (splitMethod === SplitACMethod.EQUAL) {
    splitMethodIcon = '='
  } else if (splitMethod === SplitACMethod.PROPORTIONAL) {
    splitMethodIcon = '%'
  }
  const costLimit = props.costLimit ?? props.supperGroup?.costLimit
  const currentAmount = props.currentFoodCost ?? props.supperGroup?.currentFoodCost ?? 0

  const percentageInProgressBar = costLimit ? (currentAmount / costLimit) * 100 : 0
  const amountLeft = costLimit ? `$${(costLimit - currentAmount).toFixed(2)}left` : 'No Limit'

  return (
    <MainCard flexDirection="row" minHeight="fit-content">
      <LeftContainer>
        {isLoading ? (
          <StyledSkeleton active paragraph={false} height="80px" width="80px" borderRadius="10px" />
        ) : (
          <RestaurantLogo src={restaurantLogo} alt="Restaurant logo" />
        )}
      </LeftContainer>
      <RightContainer>
        <StyledGroupIdText>{isLoading ? <StyledSkeleton active paragraph={false} /> : idText}</StyledGroupIdText>
        <StyledGroupNameText>
          {isLoading ? <StyledSkeleton active paragraph={false} height="14px" width="200px" /> : supperGroupName}
        </StyledGroupNameText>
        {isLoading ? (
          <StyledSkeleton active paragraph={false} width="150px" />
        ) : (
          <GroupInfoContainer>
            <InfoSubContainer>
              <FieldTimeOutlined style={iconStyle} />
              {closingTime}
            </InfoSubContainer>
            <InfoSubContainer color={V1_RED}>
              <UserOutlined style={iconStyle} />
              {numberOfUsers}
            </InfoSubContainer>
            <InfoSubContainer>
              <CarOutlined style={iconStyle} />
              {deliveryCost} {splitMethodIcon}
            </InfoSubContainer>
          </GroupInfoContainer>
        )}
        {isLoading ? (
          <StyledSkeleton active paragraph={false} width="150px" />
        ) : (
          <GroupCostInfoContainer>
            <StyledProgessBar
              strokeColor={V1_RED}
              strokeWidth={12}
              percent={percentageInProgressBar}
              showInfo={false}
            />
            {amountLeft}
          </GroupCostInfoContainer>
        )}
      </RightContainer>
    </MainCard>
  )
}
