import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setCount, setDeliveryTime } from '../../store/supper/action/setter'
import { RootState } from '../../store/types'
import { MinusButton } from './MinusButton'
import { PlusButton } from './PlusButton'

const TimerContainer = styled.div<{ center?: boolean; margin?: string }>`
  ${(props) => props.center && 'margin: auto'}
  ${(props) => props.margin && `margin: ${props.margin};`}
`

const ValueContainer = styled.text`
  font-size: 24px;
  font-weight: 500;
  margin: 20px;
`

type Props = {
  min?: number
  default: number
  center?: boolean
  margin?: string
}

export const DeliveryTimeSetter = (props: Props) => {
  const dispatch = useDispatch()
  const { deliveryTime } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    dispatch(setDeliveryTime(props.default))
    dispatch(setCount(props.default))
  }, [])

  const subTime = () => {
    const diffVal = deliveryTime - (props.min ?? 0)
    if (diffVal < 5) {
      dispatch(setDeliveryTime(deliveryTime - diffVal))
      dispatch(setCount(deliveryTime - diffVal))
    } else if (deliveryTime !== (props.min ?? 0)) {
      dispatch(setDeliveryTime(deliveryTime - 5))
      dispatch(setCount(deliveryTime - 5))
    }
  }

  const addTime = () => {
    dispatch(setDeliveryTime(deliveryTime + 5))
    dispatch(setCount(deliveryTime + 5))
  }

  return (
    <TimerContainer center={props.center ?? false} margin={props.margin}>
      <MinusButton increment={5} min={props.min} defaultValue={props.default} color="DARK_BLUE" onClick={subTime} />
      <ValueContainer>{deliveryTime} mins</ValueContainer>
      <PlusButton color="DARK_BLUE" isAdding={true} onClick={addTime} />
    </TimerContainer>
  )
}
