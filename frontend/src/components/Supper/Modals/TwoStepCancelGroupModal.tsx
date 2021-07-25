import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import styled from 'styled-components'
import { SupperModal } from './SupperModal'
import { SupperGroupStatus } from '../../../store/supper/types'
import { FormHeader } from '../FormHeader'
import { FieldError, useForm } from 'react-hook-form'
import { V1_BACKGROUND, V1_RED } from '../../../common/colours'
import { updateSupperGroup } from '../../../store/supper/action/level1/putRequests'

const DescriptionText = styled.div`
  padding-bottom: 1rem;
`

const TextArea = styled.textarea<{ error?: FieldError | undefined }>`
  width: 100%;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 3px auto 10px auto;
  height: fit-content;
  ${(props) => props.error && 'borderColor: red; background:#ffd1d1;'}

  ::placeholder {
    line-height: 18px;
  }
`

const ErrorText = styled.p`
  margin: 0 0 0.5rem 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-family: 'Inter';
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
`

type Props = {
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  onLeftButtonClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  supperGroupId: string | number
}

type FormData = {
  cancelReason: string
}

export const TwoStepCancelGroupModal = (props: Props, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  const dispatch = useDispatch()
  const [modalNum, setModalNum] = useState<number>(1)
  const { register, handleSubmit, errors } = useForm<FormData>()

  const onDoneClick = () => {
    handleSubmit((data) => {
      console.log(data)
      const updatedInfo = {
        status: SupperGroupStatus.CANCELLED,
        comments: data.cancelReason,
      }
      dispatch(updateSupperGroup(props.supperGroupId, updatedInfo))
      props.modalSetter(false)
    })()
    if (props.onLeftButtonClick) props.onLeftButtonClick(e)
  }

  return (
    <>
      {modalNum === 1 ? (
        <SupperModal
          title="Cancel Supper Group?"
          description={
            <DescriptionText>
              If you are unable to order for the group (e.g. the restaurant closed, you changed your mind, there are no
              delivery riders, etc), you may choose to cancel the group order.
              <br /> <br />
              This action will update supper group status as &#34;cancelled&#34; and all joiners will be notified.
            </DescriptionText>
          }
          leftButtonText="Continue"
          onLeftButtonClick={() => setModalNum(2)}
          onRightButtonClick={() => props.modalSetter(false)}
        />
      ) : (
        <SupperModal
          title="Cancel Supper Group?"
          description={
            <Form>
              <FormHeader headerName="Reason for cancelling" isCompulsory />
              <TextArea
                defaultValue={''}
                placeholder="e.g. the restaurant closed, there are no delivery riders, etc.."
                name="cancelReason"
                ref={register({
                  required: false,
                  validate: (input) => input.trim().length !== 0,
                })}
                error={errors.cancelReason}
              />
              {errors.cancelReason?.type && <ErrorText>Reason required!</ErrorText>}
            </Form>
          }
          leftButtonText="Back"
          leftButtonColor={V1_BACKGROUND}
          leftButtonTextColor="black"
          onLeftButtonClick={() => setModalNum(1)}
          rightButtonText="Done"
          rightButtonColor={V1_RED}
          rightButtonTextColor="white"
          onRightButtonClick={onDoneClick}
          rightButtonHtmlType="submit"
        />
      )}
    </>
  )
}
