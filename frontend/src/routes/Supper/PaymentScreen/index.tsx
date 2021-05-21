import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import { SGPaymentStatus } from '../../../components/Supper/CustomCards/SGPaymentStatus'
import { getSupperGroupById } from '../../../store/supper/action'
import { RootState } from '../../../store/types'

const MainContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  background-color: #fafaf4;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90vw;
  margin: 0 auto;
  padding-bottom: 3rem;
  align-items: flex-end;
`

const SubContainer = styled.div`
  width: 13rem;
  display: flex;
  justify-content: space-between;
  margin: 7px 10px;
`

const StyledText = styled.text`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
`

const PaymentScreen = () => {
  const dispatch = useDispatch()
  const params = useParams<{ supperGroupId: string }>()
  const { supperGroup, isLoading } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    dispatch(getSupperGroupById(params.supperGroupId))
  }, [dispatch])

  return (
    <MainContainer>
      <TopNavBar title="Payment" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <SGPaymentStatus supperGroup={supperGroup} />
          <BottomContainer>
            <SubContainer>
              <StyledText>Total Price</StyledText>
              <StyledText>${(supperGroup?.currentFoodCost ?? 0).toFixed(2)}</StyledText>
            </SubContainer>
            <SubContainer>
              <StyledText>Delivery Fee</StyledText>
              <StyledText>${(supperGroup?.additionalCost ?? 0).toFixed(2)}</StyledText>
            </SubContainer>
            <SubContainer>
              <StyledText>
                <b>Total</b>
              </StyledText>
              <StyledText>
                <b>${(supperGroup?.totalPrice ?? 0).toFixed(2)}</b>
              </StyledText>
            </SubContainer>
          </BottomContainer>
        </>
      )}
    </MainContainer>
  )
}

export default PaymentScreen
