import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

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
import { getReadableSupperGroupId } from '../../common/getReadableSupperGroupId'
import { V1_RED } from '../../common/colours'
import { CarOutlined, FieldTimeOutlined, UserOutlined } from '@ant-design/icons'
import { Skeleton } from '../Skeleton'
import EqualCircle from '../../assets/supper/EqualCircle.svg'
import PercentCircle from '../../assets/supper/PercentCircle.svg'
import { MoreDropDown } from './MoreDropDown'
import { PATHS } from '../../routes/Routes'
import { SupperShareModal } from './Modals/SupperShareModal'
import { SGStatusCard } from './CustomCards/SGStatusCard'
import { RootState } from '../../store/types'
import { unixTo12HourTime } from '../../common/unixTo12HourTime'
import { CancelGroupModal } from './Modals/CancelGroupModal'
import { LeaveGroupModal } from './Modals/LeaveGroupModal'

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
  font-weight: 500;
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

// const ErrorText = styled.text`
//   text-align: center;
//   color: ${V1_RED};
//   font-family: 'Inter';
// `

const Icon = styled.img`
  padding-left: 5px;
  height: 14px;
`

const ClickableContainer = styled.div`
  display: flex;
  flex-direction: row;
`

type Props = {
  supperGroup?: SupperGroup | null
  homeSupperGroup?: HomeSupperGroup
  isHome: boolean // makes card clickable
  comments?: string | undefined
  paymentInfo?: PaymentInfo[]
  location?: string
  estArrivalTime?: number
  statusOnly?: boolean | undefined // makes card clickable
  margin?: string
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const SupperGroupCard = (props: Props) => {
  const history = useHistory()
  const supperGroup = props.isHome ? props.homeSupperGroup : props.supperGroup
  const { isLoading } = useSelector((state: RootState) => state.supper)
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false)
  const [isCancelGroupModalOpen, setIsCancelGroupModalOpen] = useState<boolean>(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false)
  const supperGroupStatus = supperGroup?.status
  const isOpenOrPending =
    supperGroupStatus === SupperGroupStatus.OPEN || supperGroupStatus === SupperGroupStatus.PENDING
  const showStatusOnly = props.statusOnly ?? false
  const isClickableCard = props.isHome || props.statusOnly

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
      cancelModalSetter={setIsCancelGroupModalOpen}
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
  const location = props.supperGroup?.location ?? props.location
  const paymentInfo = props.supperGroup?.paymentInfo ?? props.paymentInfo
  const cancelReason = props.supperGroup?.comments ?? props.comments
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

  const cancelModal = (
    <CancelGroupModal
      modalSetter={setIsCancelGroupModalOpen}
      withDispatch
      onLeftButtonClick={() => history.goBack()}
      supperGroupId={rawSupperGroupId}
    />
  )

  const leaveModal = (
    <LeaveGroupModal
      modalSetter={setIsLeaveModalOpen}
      onLeftButtonClick={() => {
        history.replace(PATHS.SUPPER_HOME)
        history.push(`${PATHS.JOIN_GROUP}/${rawSupperGroupId}`)
      }}
      supperGroupId={rawSupperGroupId}
    />
  )

  const onSupperCardClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (isClickableCard) {
      if (props.onClick) return props.onClick(e)
      else {
        if (ownerId === localStorage.userID || (supperGroup?.userIdList ?? []).includes(localStorage.userID)) {
          // User is the owner or already has an ongoing order
          history.push(`${PATHS.VIEW_ORDER}/${rawSupperGroupId}`)
        } else {
          // New SG to user
          history.push(`${PATHS.JOIN_GROUP}/${rawSupperGroupId}`)
        }
      }
    }
  }

  return isOpenOrPending ? (
    <MainCard margin={props.margin} flexDirection="row" minHeight="fit-content">
      <>
        {isShareModalOpen && shareModal}
        {isCancelGroupModalOpen && cancelModal}
        {isLeaveModalOpen && leaveModal}
      </>
      {/* {hasError ? (
        <> find a way to do error handline
          <LeftContainer>
            <RestaurantLogo src={restaurantLogo} alt="Restaurant logo" />
          </LeftContainer>
          <RightContainer>
            <ErrorText>
              meowmeow ate the supper group.. <u onClick={onRefresh}>reload</u> or{' '}
              <u onClick={() => history.goBack()}>go back</u>
            </ErrorText>
          </RightContainer>
        </>*/}
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
    </MainCard>
  ) : (
    <SGStatusCard
      margin={props.margin}
      onCardClick={onSupperCardClick}
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
