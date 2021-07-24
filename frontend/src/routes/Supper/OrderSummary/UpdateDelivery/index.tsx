import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import { V1_GREY_BACKGROUND } from '../../../../common/colours'
import LoadingSpin from '../../../../components/LoadingSpin'
import TopNavBar from '../../../../components/Mobile/TopNavBar'
import { OwnerUpdateItemCard } from '../../../../components/Supper/CustomCards/OwnerUpdateItemCard'
import { DiscardChangesModal } from '../../../../components/Supper/Modals/DiscardChangesModal'
import { getSupperGroupById } from '../../../../store/supper/action/level1/getReqests'
import { RootState } from '../../../../store/types'

export const OldInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1rem 23px;
  background-color: ${V1_GREY_BACKGROUND};
  padding: 10px;
  border-radius: 5px;
`

const DeliveryText = styled.text`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
`

const PriceText = styled.text`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 14px;
`

const UpdateDelivery = () => {
  const params = useParams<{ supperGroupId: string }>()
  const dispatch = useDispatch()
  const history = useHistory()
  const { supperGroup, isLoading } = useSelector((state: RootState) => state.supper)
  const [hasTouched, setHasTouched] = useState<boolean>(false)
  const [discardChangesModalIsOpen, setDiscardChangesModalIsOpen] = useState<boolean>(false)

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
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
          <OldInfoContainer>
            <DeliveryText>Total Delivery Fee</DeliveryText>
            <PriceText>${(supperGroup?.additionalCost ?? 0).toFixed(2)}</PriceText>
          </OldInfoContainer>
          <OwnerUpdateItemCard deliveryFee hasTouchedSetter={setHasTouched} supperGroup={supperGroup} />
        </>
      )}
    </>
  )
}

export default UpdateDelivery
