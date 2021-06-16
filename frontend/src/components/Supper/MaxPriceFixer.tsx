import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setCount, setPriceLimit } from '../../store/supper/action'
import { RootState } from '../../store/types'
import { MinusButton } from './MinusButton'
import { PlusButton } from './PlusButton'

const CounterContainer = styled.div<{ center?: boolean }>`
  ${(props) => props.center && 'margin: 0 auto;'}
`

const ValueContainer = styled.text`
  font-size: 24px;
  font-weight: 500;
  margin: 25px;
`

type Props = {
  defaultValue?: number | undefined
  center?: boolean | undefined
}

export const MaxPriceFixer = (props: Props) => {
  const dispatch = useDispatch()
  const { priceLimit } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    dispatch(setPriceLimit(props.defaultValue ?? 0))
  }, [])

  const subFromPriceLimit = () => {
    if (priceLimit > 0) {
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
      <MinusButton defaultValue={props.defaultValue} color="DARK_BLUE" onClick={subFromPriceLimit} />
      <ValueContainer>${priceLimit}</ValueContainer>
      <PlusButton color="DARK_BLUE" isAdding={true} onClick={addToPriceLimit} />
    </CounterContainer>
  )
}
