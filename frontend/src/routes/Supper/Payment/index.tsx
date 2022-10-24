import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import { V1_BACKGROUND } from '../../../common/colours'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { FormHeader } from '../../../components/Supper/FormHeader'
import { DiscardChangesModal } from '../../../components/Supper/Modals/DiscardChangesModal'
import { MarkPaymentCompleteModal } from '../../../components/Supper/Modals/MarkPaymentCompleteModal'
import { PaymentMethodBubbles } from '../../../components/Supper/PaymentMethodBubbles'
import { RefreshIcon } from '../../../components/Supper/RefreshIcon'
import { SupperButton } from '../../../components/Supper/SupperButton'
import { paymentMethods } from '../../../store/stubs'
import { setSelectedPaymentMethod } from '../../../store/supper/action/setter'
import { PaymentMethod } from '../../../store/supper/types'
import { RootState } from '../../../store/types'

const Background = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  grid-template-areas: '.' '.' '.';
  height: 100vh;
  width: 100vw;
  background: ${V1_BACKGROUND};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 80vw;
  margin: 0 auto;
`

const ErrorText = styled.p`
  margin: 5px 0 0 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-family: 'Inter';
`

const Input = styled.input`
  width: 100%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
`

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0 1.5rem 0;
`

type FormValues = {
  paymentMethod: PaymentMethod[]
  phoneNumber: number
}

const Payment = () => {
  const params = useParams<{ orderId: string }>()
  const history = useHistory()
  const dispatch = useDispatch()
  const [markPaymentCompleteModalIsOpen, setMarkPaymentCompleteModalIsOpen] = useState<boolean>(false)
  const [hasChangedModal, setHasChangedModal] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    clearErrors,
    formState: { touched },
  } = useForm<FormValues>()
  const { selectedPaymentMethod } = useSelector((state: RootState) => state.supper)
  const errorStyling = {
    borderColor: 'red',
    background: '#ffd1d1',
  }

  useEffect(() => {
    dispatch(setSelectedPaymentMethod([]))
  }, [])

  useEffect(() => {
    if (watch('paymentMethod') !== selectedPaymentMethod) setValue('paymentMethod', selectedPaymentMethod)
    if (selectedPaymentMethod.length) clearErrors('paymentMethod')
  }, [watch('paymentMethod'), selectedPaymentMethod])

  const onLeftClick = () => {
    Object.values(touched).length || selectedPaymentMethod.length ? setHasChangedModal(true) : history.goBack()
  }

  const onSubmit = (e) => {
    e.preventDefault()
    handleSubmit(() => {
      setMarkPaymentCompleteModalIsOpen(true)
    })()
  }

  return (
    <Background>
      <TopNavBar title="Payment" onLeftClick={onLeftClick} rightComponent={<RefreshIcon />} />
      {markPaymentCompleteModalIsOpen && (
        <MarkPaymentCompleteModal
          modalSetter={setMarkPaymentCompleteModalIsOpen}
          orderId={params.orderId}
          phoneNumber={watch('phoneNumber')}
          paymentMethod={watch('paymentMethod')[0]}
        />
      )}
      {hasChangedModal && <DiscardChangesModal modalSetter={setHasChangedModal} />}
      <Form onSubmit={onSubmit}>
        <FormSection>
          <FormHeader fontSize="15px" headerName="Which payment mode did you pay via?" isCompulsory />
          <PaymentMethodBubbles
            onlyOne
            {...(register('paymentMethod', { required: true, validate: (input) => input.length !== 0 }) as any)}
            paymentMethods={paymentMethods}
          />
          {errors.paymentMethod && <ErrorText>Payment method required!</ErrorText>}
        </FormSection>
        <FormSection>
          <FormHeader fontSize="15px" headerName="What is your phone number?" isCompulsory />
          <Input
            type="number"
            defaultValue=""
            placeholder="Phone Number"
            name="phoneNumber"
            ref={register({
              required: true,
              valueAsNumber: true,
            })}
            style={errors.phoneNumber ? errorStyling : {}}
          />
          {errors.phoneNumber?.type === 'required' && <ErrorText>Phone Number required!</ErrorText>}
        </FormSection>
        <SupperButton style={{ marginTop: '1.5rem' }} defaultButtonDescription="Done" htmlType="submit" center />
      </Form>
      <BottomNavBar />
    </Background>
  )
}

export default Payment
