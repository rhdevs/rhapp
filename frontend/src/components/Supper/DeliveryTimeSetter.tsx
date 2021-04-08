import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setDeliveryTime } from '../../store/supper/action'
import { RootState } from '../../store/types'
import { MinusButton } from './MinusButton'
import { PlusButton } from './PlusButton'

const TimerContainer = styled.div``

const ValueContainer = styled.text`
  font-size: 24px;
  font-weight: 500;
  margin: 20px;
`
type Props = {
  default: number
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
    <TimerContainer>
      <MinusButton color="DARK_BLUE" onClick={subTime} />
      <ValueContainer>{deliveryTime} mins</ValueContainer>
      <PlusButton color="DARK_BLUE" isAdding={true} onClick={addTime} />
    </TimerContainer>
  )
}
