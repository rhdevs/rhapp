import React, { useState } from 'react'

import styled from 'styled-components'
import { getRestaurantLogo } from '../../common/getRestaurantLogo'
import { Restaurants, SplitACMethod, SupperGroup } from '../../store/supper/types'
import { MainCard } from './MainCard'
import { Dropdown, Menu, Progress } from 'antd'
import { getReadableSupperGroupId, unixTo12HourTime } from '../../store/supper/action'
import { V1_RED } from '../../common/colours'
import { CarOutlined, FieldTimeOutlined, MoreOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons'
import { Skeleton } from '../Skeleton'
import { onRefresh } from '../../common/reloadPage'
import { useHistory } from 'react-router-dom'
import EqualCircle from '../../assets/supper/EqualCircle.svg'
import PercentCircle from '../../assets/supper/PercentCircle.svg'

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
  font-weight: 200;
  font-size: 12px;
`

const StyledGroupNameText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
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
  padding-right: 4px;
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
  margin-right: 10px;
`

const ErrorText = styled.text`
  text-align: center;
  color: ${V1_RED};
  font-family: 'Inter';
`

const Icon = styled.img`
  padding-left: 5px;
  height: 14px;
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
  const [hasError, setHasError] = useState<boolean>(false)
  const history = useHistory()

  setTimeout(() => {
    // if details still dont show after 20s, show error
    if (isLoading) {
      setHasError(true)
    }
  }, 20000)

  const iconStyle = {
    color: 'rgba(0, 0, 0, 0.65)',
    paddingRight: '2px',
  } // For time, car and user

  const onShareClick = () => {
    //TODO: @xinyee add share modal
    console.log('Show modal to share supper group')
  }

  const dropDownComponent = () => {
    //TODO: Update with finalised dropdown component
    return (
      <Menu>
        <Menu.Item key="0">
          <a href="#">1st menu item</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="#">2nd menu item</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">3rd menu item</Menu.Item>
      </Menu>
    )
  }
  const restaurantLogo = getRestaurantLogo((props.restaurantName ?? props.supperGroup?.restaurantName) as Restaurants)
  const supperGroupId = getReadableSupperGroupId(props.supperGroupId ?? props.supperGroup?.supperGroupId)
  const ownerName = `(${
    (props.ownerId ?? props.supperGroup?.ownerId) === localStorage.userID
      ? 'You'
      : props.ownerName ?? props.supperGroup?.ownerName ?? '-'
  })`
  const topIcon =
    (props.ownerId ?? props.supperGroup?.ownerId) == localStorage.userID ? (
      <Dropdown overlay={dropDownComponent} trigger={['click']}>
        <MoreOutlined
          onClick={(e) => e.preventDefault()}
          style={{ position: 'absolute', right: '18px', transform: 'rotate(90deg)', fontSize: '18px' }}
        />
      </Dropdown>
    ) : (
      <ShareAltOutlined
        onClick={onShareClick}
        style={{ color: V1_RED, position: 'absolute', right: '18px', fontSize: '18px' }}
      />
    )
  const idText = `${supperGroupId} ${ownerName}`
  const supperGroupName = props.supperGroupName ?? props.supperGroup?.supperGroupName
  const closingTime = unixTo12HourTime(props.closingTime ?? props.supperGroup?.closingTime)
  const numberOfUsers = props.numOrders ?? props.supperGroup?.numOrders ?? 1 // To include owner
  const deliveryCost = `$${(props.additionalCost ?? props.supperGroup?.additionalCost ?? 0).toFixed(2)}`
  const splitMethod = props.splitAdditionalCost ?? props.supperGroup?.splitAdditionalCost
  let splitMethodIcon

  if (splitMethod === SplitACMethod.EQUAL) {
    splitMethodIcon = <Icon src={EqualCircle} alt="Equal" />
  } else if (splitMethod === SplitACMethod.PROPORTIONAL) {
    splitMethodIcon = <Icon src={PercentCircle} alt="Proprotional" />
  }
  const costLimit = props.costLimit ?? props.supperGroup?.costLimit
  const currentAmount = props.currentFoodCost ?? props.supperGroup?.currentFoodCost ?? 0

  const percentageInProgressBar = costLimit ? (currentAmount / costLimit) * 100 : 0
  const amountLeft = costLimit ? `$${(costLimit - currentAmount).toFixed(2)} left` : 'No Limit'

  return (
    <MainCard flexDirection="row" minHeight="fit-content">
      {hasError ? (
        <>
          <LeftContainer>
            <RestaurantLogo src={restaurantLogo} alt="Restaurant logo" />
          </LeftContainer>
          <RightContainer>
            <ErrorText>
              meowmeow ate the supper group.. <u onClick={onRefresh}>reload</u> or
              <u onClick={() => history.goBack()}> go back</u>
            </ErrorText>
          </RightContainer>
        </>
      ) : (
        <>
          <LeftContainer>
            {isLoading ? <Skeleton image /> : <RestaurantLogo src={restaurantLogo} alt="Restaurant logo" />}
          </LeftContainer>
          <RightContainer>
            {topIcon}
            <StyledGroupIdText>{isLoading ? <Skeleton /> : idText}</StyledGroupIdText>
            <StyledGroupNameText>
              {isLoading ? <Skeleton height="14px" width="200px" /> : supperGroupName}
            </StyledGroupNameText>
            {isLoading ? (
              <Skeleton width="150px" />
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
              <Skeleton width="180px" />
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
        </>
      )}
    </MainCard>
  )
}
