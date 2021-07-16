import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import { V1_RED } from '../../../../common/colours'
import { onRefresh } from '../../../../common/reloadPage'
import LoadingSpin from '../../../../components/LoadingSpin'
import TopNavBar from '../../../../components/Mobile/TopNavBar'
import { OwnerUpdateItemCard } from '../../../../components/Supper/CustomCards/OwnerUpdateItemCard'
import { FoodLine } from '../../../../components/Supper/FoodLine'
import { DiscardChangesModal } from '../../../../components/Supper/Modals/DiscardChangesModal'
import { getFoodInOrder } from '../../../../store/supper/action'
import { RootState } from '../../../../store/types'
import { OldInfoContainer } from '../UpdateDelivery'

const ErrorText = styled.text`
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
  const { food, isLoading } = useSelector((state: RootState) => state.supper)
  const [hasTouched, setHasTouched] = useState<boolean>(false)
  const [discardChangesModalIsOpen, setDiscardChangesModalIsOpen] = useState<boolean>(false)

  useEffect(() => {
    dispatch(getFoodInOrder(params.orderId, params.foodId))
  }, [dispatch])

  return (
    <>
      <TopNavBar
        title="Order Summary"
        onLeftClick={() => {
          if (hasTouched) {
            setDiscardChangesModalIsOpen(true)
          } else {
            history.goBack()
          }
        }}
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          {discardChangesModalIsOpen && (
            <DiscardChangesModal
              modalSetter={setDiscardChangesModalIsOpen}
              onLeftButtonClick={() => history.goBack()}
            />
          )}
          {food ? (
            <FoodLine backgroundColor="#ededed" borderRadius="5px" margin="1rem 23px" padding="10px" food={food} />
          ) : (
            <OldInfoContainer>
              <ErrorText>
                Do you remember what you clicked? bc we forgot... <u onClick={onRefresh}>Reload</u> or
                <u onClick={() => history.goBack()}> go back</u>
              </ErrorText>
            </OldInfoContainer>
          )}
          <OwnerUpdateItemCard foodItem hasTouchedSetter={setHasTouched} food={food} orderId={params.orderId} />
        </>
      )}
    </>
  )
}

export default UpdateItem
