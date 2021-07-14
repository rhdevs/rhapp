import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { V1_BACKGROUND } from '../../../common/colours'

import LoadingSpin from '../../../components/LoadingSpin'
import Button from '../../../components/Mobile/Button'
import { ConfirmationModal } from '../../../components/Mobile/ConfirmationModal'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { SGPaymentStatus } from '../../../components/Supper/CustomCards/SGPaymentStatus'
import { deleteSupperGroup, getSupperGroupById, updateSupperGroupPaymentStatus } from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import { PATHS } from '../../Routes'

const MainContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  background-color: ${V1_BACKGROUND};
`

const PaymentScreen = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string }>()
  const { supperGroup, isLoading, paymentUpdateArray } = useSelector((state: RootState) => state.supper)
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)

  const onCancelClick = () => {
    setModalIsOpen(false)
  }

  const onConfirmEndClick = () => {
    dispatch(deleteSupperGroup(params.supperGroupId))
    history.push(`${PATHS.SUPPER_HOME}`)
  }

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
  }, [dispatch])

  return (
    <MainContainer>
      <TopNavBar
        title="Payment"
        onLeftClick={() => {
          updateSupperGroupPaymentStatus(params.supperGroupId, paymentUpdateArray)
          history.goBack()
        }}
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          {modalIsOpen && (
            <ConfirmationModal
              title="End Supper Group?"
              description="All order and payment information will be deleted."
              hasLeftButton={true}
              leftButtonText={'End'}
              onLeftButtonClick={onConfirmEndClick}
              rightButtonText={'Cancel'}
              onRightButtonClick={onCancelClick}
            />
          )}
          <SGPaymentStatus margin="5px 23px" supperGroup={supperGroup} />
          <Button
            center
            containerPadding="2rem 0"
            stopPropagation
            defaultButtonDescription="End Supper Group"
            onButtonClick={() => {
              setModalIsOpen(!modalIsOpen)
            }}
            isFlipButton={false}
          />
        </>
      )}
    </MainContainer>
  )
}

export default PaymentScreen
