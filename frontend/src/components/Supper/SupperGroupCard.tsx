import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { getRestaurantLogo } from '../../common/getRestaurantLogo'
import {
  HomeSupperGroup,
  PaymentInfo,
  Restaurants,
  SplitACMethod,
  SupperGroup,
  SupperGroupStatus,
} from '../../store/supper/types'
import { MainCard } from './MainCard'
import { Progress } from 'antd'
import {
  deleteSupperGroup,
  getReadableSupperGroupId,
  leaveSupperGroup,
  setIsLoading,
  unixTo12HourTime,
} from '../../store/supper/action'
import { V1_RED } from '../../common/colours'
import { CarOutlined, FieldTimeOutlined, UserOutlined } from '@ant-design/icons'
import { Skeleton } from '../Skeleton'
import { onRefresh } from '../../common/reloadPage'
import { useHistory } from 'react-router-dom'
import EqualCircle from '../../assets/supper/EqualCircle.svg'
import PercentCircle from '../../assets/supper/PercentCircle.svg'
import { MoreDropDown } from './MoreDropDown'
import ConfirmationModal from '../Mobile/ConfirmationModal'
import { useDispatch, useSelector } from 'react-redux'
import { PATHS } from '../../routes/Routes'
import { SupperShareModal } from './SupperShareModal'
import { SGStatusCard } from './CustomCards/SGStatusCard'
import { RootState } from '../../store/types'

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

const ClickableContainer = styled.div`
  display: flex;
  flex-direction: row;
`

type Props = {
  supperGroup?: SupperGroup
  homeSupperGroup?: HomeSupperGroup
  isHome: boolean
  comments?: string | undefined
  paymentInfo?: PaymentInfo[]
  location?: string
  estArrivalTime?: number
  statusOnly?: boolean | undefined
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const SupperGroupCard = (props: Props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const supperGroup = props.isHome ? props.homeSupperGroup : props.supperGroup
  useEffect(() => {
    if (props.isHome ? props.homeSupperGroup : props.supperGroup) {
      dispatch(setIsLoading(false))
    } else {
      dispatch(setIsLoading(true))
    }
  }, [props.homeSupperGroup, props.supperGroup])
  const { isLoading } = useSelector((state: RootState) => state.supper)

  const [hasError, setHasError] = useState<boolean>(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false)
  const supperGroupStatus = supperGroup?.status
  const isOpenOrPending =
    supperGroupStatus === SupperGroupStatus.OPEN || supperGroupStatus === SupperGroupStatus.PENDING
  const showStatusOnly = props.statusOnly ?? false

  setTimeout(() => {
    // if details still dont show after 10s, show error
    if (isLoading) {
      setHasError(true)
    }
  }, 10000)

  const iconStyle = {
    color: 'rgba(0, 0, 0, 0.65)',
    paddingRight: '4px',
  } // For time, car and user

  const restaurantLogo = getRestaurantLogo(supperGroup?.restaurantName as Restaurants)
  const rawSupperGroupId = supperGroup?.supperGroupId
  const supperGroupId = getReadableSupperGroupId(rawSupperGroupId)
  const isOwner = supperGroup?.ownerId === localStorage.userID
  const ownerName = `(${isOwner ? 'You' : supperGroup?.ownerName ?? '-'})`
  const ownerId = supperGroup?.ownerId
  const userIdList = supperGroup?.userIdList
  const topIcon = (
    <MoreDropDown
      ownerId={ownerId}
      userIdList={userIdList}
      supperGroupId={rawSupperGroupId}
      shareModalSetter={setIsShareModalOpen}
      deleteModalSetter={setIsDeleteModalOpen}
      leaveModalSetter={setIsLeaveModalOpen}
    />
  )

  const idText = `${supperGroupId} ${ownerName}`
  const supperGroupName = supperGroup?.supperGroupName
  const closingTime = unixTo12HourTime(supperGroup?.closingTime)
  const collectionTime = unixTo12HourTime(props.isHome ? props.estArrivalTime : props.supperGroup?.estArrivalTime)
  const numberOfUsers = supperGroup?.numOrders ?? 1 // To include owner
  const deliveryCost = `$${(supperGroup?.additionalCost ?? 0).toFixed(2)}`
  const splitMethod = supperGroup?.splitAdditionalCost
  const ownerTele = supperGroup?.ownerTele
  const location = props.supperGroup?.location
  const paymentInfo = props.supperGroup?.paymentInfo
  const cancelReason = props.supperGroup?.comments
  let splitMethodIcon

  if (splitMethod === SplitACMethod.EQUAL) {
    splitMethodIcon = <Icon src={EqualCircle} alt="Equal" />
  } else if (splitMethod === SplitACMethod.PROPORTIONAL) {
    splitMethodIcon = <Icon src={PercentCircle} alt="Proprotional" />
  }
  const costLimit = supperGroup?.costLimit
  const currentAmount = supperGroup?.currentFoodCost ?? 0

  const percentageInProgressBar = costLimit ? (currentAmount / costLimit) * 100 : 0
  const amountLeft = costLimit ? `$${(costLimit - currentAmount).toFixed(2)} left` : 'No Limit'

  const shareModal = <SupperShareModal rawSupperGroupId={rawSupperGroupId} teleShareModalSetter={setIsShareModalOpen} />

  const deleteModal = (
    <ConfirmationModal
      title="Delete group?"
      description="Deleting group will remove everyone's cart and delete supper group."
      hasLeftButton={true}
      leftButtonText={'Confirm'}
      onLeftButtonClick={() => {
        dispatch(deleteSupperGroup(rawSupperGroupId))
        //TODO: Check if this should be the action after deletion
        history.goBack()
      }}
      rightButtonText={'Cancel'}
      onRightButtonClick={() => setIsDeleteModalOpen(false)}
    />
  )

  const leaveModal = (
    <ConfirmationModal
      title="Leave group?"
      description="You will be removed from the supper group."
      hasLeftButton={true}
      leftButtonText={'Confirm'}
      onLeftButtonClick={() => {
        dispatch(leaveSupperGroup(rawSupperGroupId))
        //TODO: Check if this should be the action after leave
        history.push(`${PATHS.SUPPER_HOME}`)
      }}
      rightButtonText={'Cancel'}
      onRightButtonClick={() => setIsLeaveModalOpen(false)}
    />
  )

  const onSupperCardClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (props.onClick) return props.onClick(e)
    else {
      if (ownerId === localStorage.userID || (supperGroup?.userIdList ?? []).includes(localStorage.userID)) {
        console.log(supperGroup?.ownerId === localStorage.userID)
        console.log((supperGroup?.userIdList ?? []).includes(localStorage.userID))
        //user is owner or already has an ongoing order
        history.push(`${PATHS.VIEW_ORDER}/${rawSupperGroupId}`)
      } else {
        //new SG to user
        history.push(`${PATHS.JOIN_ORDER}/${rawSupperGroupId}`)
      }
    }
  }

  return isOpenOrPending ? (
    <MainCard flexDirection="row" minHeight="fit-content">
      <>
        {isShareModalOpen && shareModal}
        {isDeleteModalOpen && deleteModal}
        {isLeaveModalOpen && leaveModal}
      </>
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
          {!isLoading && topIcon}
          <ClickableContainer onClick={onSupperCardClick}>
            <LeftContainer>
              {isLoading ? <Skeleton image /> : <RestaurantLogo src={restaurantLogo} alt="Restaurant logo" />}
            </LeftContainer>
            <RightContainer>
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
          </ClickableContainer>
        </>
      )}
    </MainCard>
  ) : (
    <SGStatusCard
      isOwner={isOwner}
      supperGroupStatus={supperGroupStatus}
      restaurantLogo={restaurantLogo}
      supperGroupName={supperGroupName}
      rawSupperGroupId={rawSupperGroupId}
      idHeader={idText}
      buttonTeleHandle={ownerTele}
      location={location}
      collectionTime={collectionTime}
      paymentMethod={paymentInfo}
      cancelReason={cancelReason}
      statusOnly={showStatusOnly}
    />
  )
}
