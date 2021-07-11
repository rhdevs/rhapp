/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { V1_BACKGROUND } from '../../../common/colours'
import LoadingSpin from '../../../components/LoadingSpin'
import Button from '../../../components/Mobile/Button'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { OrderCard } from '../../../components/Supper/CustomCards/OrderCard'
import { OrderSummaryCard } from '../../../components/Supper/CustomCards/OrderSummaryCard'
import { FormHeader } from '../../../components/Supper/FormHeader'
import { getSupperGroupById, getUserOrder, updateOrderDetails } from '../../../store/supper/action'
import { RootState } from '../../../store/types'
import { SupperGroupStatus } from '../../../store/supper/types'
import { PATHS } from '../../Routes'
import Supper from '../componentsPage'

const MainContainer = styled.div`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: ${V1_BACKGROUND};
  padding-bottom: 2rem;
`

const NumberContainer = styled.div`
  margin: 5px 35px 10px 35px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`

const InputText = styled.input`
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  width: 90%;
  margin: 0px 0px 0px 0px;
  height: 35px;
`

const OrderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80vw;
  margin: 15px auto 0 auto;
  align-items: baseline;
`

const Header = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  padding-right: 5px;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80vw;
  margin: 1rem auto;
  align-items: flex-end;
`

const BottomMoneyContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 60%;
  justify-content: space-between;
  margin: 10px 0;
`

const StyledText = styled.text`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
`

const ButtonContainer = styled.div`
  display: flex;
  margin: 23px 15px;
  justify-content: space-around;
`

const ErrorText = styled.p`
  margin: 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-family: 'Inter';
`

const RedText = styled.text`
  color: red;
  padding-right: 5px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
`

type FormValues = {
  number: string
}

export default function ConfirmOrder() {
  const { register, handleSubmit, errors } = useForm<FormValues>()
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ supperGroupId: string }>()
  const { order, isLoading, supperGroup } = useSelector((state: RootState) => state.supper)
  const errorStyling = {
    borderColor: 'red',
    background: '#ffd1d1',
  }

  // const what: any = order

  useEffect(() => {
    dispatch(getUserOrder(params.supperGroupId, localStorage.userID))
    dispatch(getSupperGroupById(params.supperGroupId))
  }, [dispatch])

  const onClick = () => {
    handleSubmit((data) => {
      const updatedOrder = { ...order, userContact: data.number }
      console.log(updatedOrder)
      //TODO: Test update order
      dispatch(updateOrderDetails(order?.orderId, updatedOrder))
      history.push(`${PATHS.VIEW_ORDER}/${params.supperGroupId}`)
    })()
  }

  return (
    <MainContainer>
      <TopNavBar title="Confirm Order" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <NumberContainer>
            <FormHeader headerName="Phone Number" isCompulsory={true} />
            <InputText
              type="number"
              placeholder="Phone Number"
              name="number"
              ref={register({
                required: true,
                valueAsNumber: true,
              })}
              style={errors.number ? errorStyling : {}}
            />
          </NumberContainer>
          {errors.number?.type === 'required' && <ErrorText>This is required!</ErrorText>}
          <OrderCard
            ownerId={supperGroup?.ownerId}
            supperGroupStatus={SupperGroupStatus.OPEN}
            isEditable={false}
            order={order}
            splitCostMethod={supperGroup?.splitAdditionalCost}
            supperGroup={supperGroup}
            supperTotalCost={supperGroup?.totalPrice}
          />
          <ButtonContainer>
            <Button
              descriptionStyle={{ width: '100%' }}
              stopPropagation={true}
              defaultButtonDescription="Confirm Order"
              buttonWidth="160px"
              onButtonClick={onClick}
              isFlipButton={false}
            />
          </ButtonContainer>
        </>
      )}
    </MainContainer>
  )
}
