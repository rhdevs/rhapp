import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setPriceLimit } from '../../store/supper/action'
import { RootState } from '../../store/types'
import { MinusButton } from './MinusButton'
import { PlusButton } from './PlusButton'

const CounterContainer = styled.div``

const ValueContainer = styled.text`
  font-size: 24px;
  font-weight: 500;
  margin: 25px;
`

export const MaxPriceFixer = () => {
  const dispatch = useDispatch()
  const { priceLimit } = useSelector((state: RootState) => state.supper)

  const subFromPriceLimit = () => {
    if (priceLimit > 0) {
      dispatch(setPriceLimit(priceLimit - 5))
    }
  }

  const addToPriceLimit = () => {
    dispatch(setPriceLimit(priceLimit + 5))
  }

  return (
    <CounterContainer>
      <MinusButton color="DARK_BLUE" onClick={subFromPriceLimit} />
      <ValueContainer>${priceLimit}</ValueContainer>
      <PlusButton color="DARK_BLUE" isAdding={true} onClick={addToPriceLimit} />
    </CounterContainer>
  )
}
