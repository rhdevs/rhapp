import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import { V1_GREY_BACKGROUND, V1_RED } from '../../../../common/colours'
import { onRefresh } from '../../../../common/reloadPage'
import LoadingSpin from '../../../../components/LoadingSpin'
import TopNavBar from '../../../../components/Mobile/TopNavBar'
import { OwnerUpdateItemCard } from '../../../../components/Supper/CustomCards/OwnerUpdateItemCard'
import { FoodLine } from '../../../../components/Supper/FoodLine'
import { DiscardChangesModal } from '../../../../components/Supper/Modals/DiscardChangesModal'
import { RefreshIcon } from '../../../../components/Supper/RefreshIcon'
import { getUpdateItemPageDetails } from '../../../../store/supper/action/level2'
import { RootState } from '../../../../store/types'
import { OldInfoContainer } from '../UpdateDelivery'

const ErrorText = styled.p`
  margin: 0;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  color: ${V1_RED};
`

const UpdateItem = () => {
  const params = useParams<{ supperGroupId: string; orderId: string; foodId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const { supperGroup, food, isLoading } = useSelector((state: RootState) => state.supper)
  const [hasTouched, setHasTouched] = useState<boolean>(false)
  const [discardChangesModalIsOpen, setDiscardChangesModalIsOpen] = useState<boolean>(false)

  useEffect(() => {
    dispatch(getUpdateItemPageDetails(params.supperGroupId, params.orderId, params.foodId))
  }, [dispatch])

  return (
    <>
      <TopNavBar
        title="Order Summary"
        onLeftClick={() => (hasTouched ? setDiscardChangesModalIsOpen(true) : history.goBack())}
        rightComponent={<RefreshIcon />}
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          {discardChangesModalIsOpen && <DiscardChangesModal modalSetter={setDiscardChangesModalIsOpen} />}
          {food ? (
            <FoodLine
              backgroundColor={V1_GREY_BACKGROUND}
              borderRadius="5px"
              margin="1rem 23px"
              padding="10px"
              food={food}
            />
          ) : (
            <OldInfoContainer>
              <ErrorText>
                Do you remember what you clicked? bc we forgot... <u onClick={onRefresh}>Reload</u> or{' '}
                <u onClick={() => history.goBack()}>go back</u>
              </ErrorText>
            </OldInfoContainer>
          )}
          <OwnerUpdateItemCard
            foodItem
            hasTouchedSetter={setHasTouched}
            food={food}
            orderId={params.orderId}
            supperGroup={supperGroup}
            foodId={food?.foodId ?? params.foodId}
          />
        </>
      )}
    </>
  )
}

export default UpdateItem
