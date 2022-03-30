import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setCount, setPriceLimit } from '../../store/supper/action/setter'
import { RootState } from '../../store/types'
import { MinusButton } from './MinusButton'
import { PlusButton } from './PlusButton'

const CounterContainer = styled.div<{ center?: boolean }>`
  ${(props) => props.center && 'margin: 0 auto;'}
`

const ValueContainer = styled.p`
  font-size: 24px;
  font-weight: 500;
  margin: 25px;
`

type Props = {
  defaultValue?: number | undefined
  center?: boolean | undefined
  min?: number
}

export const MaxPriceFixer = (props: Props) => {
  const dispatch = useDispatch()
  const { priceLimit } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    dispatch(setPriceLimit(props.defaultValue ?? props.min ?? 0))
  }, [])

  const subFromPriceLimit = () => {
    const diffVal = priceLimit - (props.min ?? 0)
    if (diffVal < 5) {
      dispatch(setPriceLimit(priceLimit - diffVal))
      dispatch(setCount(priceLimit - diffVal))
    } else if (priceLimit > (props.min ?? 0)) {
      dispatch(setPriceLimit(priceLimit - 5))
      dispatch(setCount(priceLimit - 5))
    }
  }

  const addToPriceLimit = () => {
    dispatch(setPriceLimit(priceLimit + 5))
    dispatch(setCount(priceLimit + 5))
  }

  return (
    <CounterContainer center={props.center ?? false}>
      <MinusButton
        increment={5}
        min={props.min}
        defaultValue={props.defaultValue}
        color="DARK_BLUE"
        onClick={subFromPriceLimit}
      />
      <ValueContainer>${priceLimit}</ValueContainer>
      <PlusButton color="DARK_BLUE" isAdding={true} onClick={addToPriceLimit} />
    </CounterContainer>
  )
}
