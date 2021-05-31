import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setDeliveryTime } from '../../store/supper/action'
import { RootState } from '../../store/types'
import { MinusButton } from './MinusButton'
import { PlusButton } from './PlusButton'

const TimerContainer = styled.div<{ center?: boolean }>`
  ${(props) => props.center && 'margin: auto'}
`

const ValueContainer = styled.text`
  font-size: 24px;
  font-weight: 500;
  margin: 20px;
`
type Props = {
  default: number
  center?: boolean
}

export const DeliveryTimeSetter = (props: Props) => {
  const dispatch = useDispatch()
  const { deliveryTime } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    dispatch(setDeliveryTime(props.default))
  }, [])

  const subTime = () => {
    if (deliveryTime !== 0) {
      dispatch(setDeliveryTime(deliveryTime - 5))
    }
  }

  const addTime = () => {
    dispatch(setDeliveryTime(deliveryTime + 5))
  }

  return (
    <TimerContainer center={props.center}>
      <MinusButton color="DARK_BLUE" onClick={subTime} />
      <ValueContainer>{deliveryTime} mins</ValueContainer>
      <PlusButton color="DARK_BLUE" isAdding={true} onClick={addTime} />
    </TimerContainer>
  )
}