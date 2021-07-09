import React, { useState } from 'react'

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
import { deleteSupperGroup, getReadableSupperGroupId, unixTo12HourTime } from '../../store/supper/action'
import { V1_RED } from '../../common/colours'
import { CarOutlined, FieldTimeOutlined, UserOutlined } from '@ant-design/icons'
import { Skeleton } from '../Skeleton'
import { onRefresh } from '../../common/reloadPage'
import { useHistory } from 'react-router-dom'
import EqualCircle from '../../assets/supper/EqualCircle.svg'
import PercentCircle from '../../assets/supper/PercentCircle.svg'
import { MoreDropDown } from './MoreDropDown'
import ConfirmationModal from '../Mobile/ConfirmationModal'
import { useDispatch } from 'react-redux'
import { PATHS } from '../../routes/Routes'
import { SupperShareModal } from './SupperShareModal'
import { SGStatusCard } from './CustomCards/SGStatusCard'

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
  const isLoading = props.supperGroup ? false : true
  const [hasError, setHasError] = useState<boolean>(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const isOpenOrPending =
    props.supperGroup?.status === SupperGroupStatus.OPEN || props.supperGroup?.status === SupperGroupStatus.PENDING
  const showStatusOnly = props.statusOnly ?? false

  setTimeout(() => {
    // if details still dont show after 10s, show error
    if (isLoading) {
      setHasError(true)
    }
  }, 10000)

  const iconStyle = {
    color: 'rgba(0, 0, 0, 0.65)',
    paddingRight: '2px',
  } // For time, car and user

  const restaurantLogo = getRestaurantLogo(props.supperGroup?.restaurantName as Restaurants)
  const rawSupperGroupId = props.supperGroup?.supperGroupId
  const supperGroupId = getReadableSupperGroupId(rawSupperGroupId)
  const isOwner = props.supperGroup?.ownerId === localStorage.userID
  const ownerName = `(${isOwner ? 'You' : props.supperGroup?.ownerName ?? '-'})`
  const ownerId = props.supperGroup?.ownerId
  const userIdList = props.supperGroup?.userIdList
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
  const supperGroupName = props.supperGroup?.supperGroupName
  const closingTime = unixTo12HourTime(props.supperGroup?.closingTime)
  const collectionTime = unixTo12HourTime(props.isHome ? props.estArrivalTime : props.supperGroup?.estArrivalTime)
  const numberOfUsers = props.supperGroup?.numOrders ?? 1 // To include owner
  const deliveryCost = `$${(props.supperGroup?.additionalCost ?? 0).toFixed(2)}`
  const splitMethod = props.supperGroup?.splitAdditionalCost
  const supperGroupStatus = props.supperGroup?.status
  const ownerTele = props.supperGroup?.ownerTele
  const location = props.isHome ? props.location : props.supperGroup?.location
  const paymentInfo = props.isHome ? props.paymentInfo : props.supperGroup?.paymentInfo
  const cancelReason = props.isHome ? props.comments : props.supperGroup?.comments
  let splitMethodIcon

  if (splitMethod === SplitACMethod.EQUAL) {
    splitMethodIcon = <Icon src={EqualCircle} alt="Equal" />
  } else if (splitMethod === SplitACMethod.PROPORTIONAL) {
    splitMethodIcon = <Icon src={PercentCircle} alt="Proprotional" />
  }
  const costLimit = props.supperGroup?.costLimit
  const currentAmount = props.supperGroup?.currentFoodCost ?? 0

  const percentageInProgressBar = costLimit ? (currentAmount / costLimit) * 100 : 0
  const amountLeft = costLimit ? `$${(costLimit - currentAmount).toFixed(2)} left` : 'No Limit'

  const shareModal = <SupperShareModal supperGroupId={supperGroupId} teleShareModalSetter={setIsShareModalOpen} />

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
        // dispatch(leaveSupperGroup(rawSupperGroupId))
        //TODO: Check if this should be the action after leave
        history.push(`${PATHS.SUPPER_HOME}`)
      }}
      rightButtonText={'Cancel'}
      onRightButtonClick={() => setIsLeaveModalOpen(false)}
    />
  )

  return isOpenOrPending ? (
    <MainCard onClick={props.onClick} flexDirection="row" minHeight="fit-content">
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
          <LeftContainer>
            {isLoading ? <Skeleton image /> : <RestaurantLogo src={restaurantLogo} alt="Restaurant logo" />}
          </LeftContainer>
          <RightContainer>
            {!isLoading && topIcon}
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
  ) : (
    <SGStatusCard
      isOwner={isOwner}
      supperGroupStatus={supperGroupStatus}
      restaurantLogo={restaurantLogo}
      supperGroupName={supperGroupName}
      supperGroupId={supperGroupId}
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
