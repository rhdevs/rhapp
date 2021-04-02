import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setCount } from '../../store/supper/action'
import { RootState } from '../../store/types'
import { MinusButton } from './MinusButton'
import { PlusButton } from './PlusButton'

const CounterContainer = styled.div``

const ValueContainer = styled.text`
  font-size: 24px;
  font-weight: 500;
  margin: 20px;
`
type Props = {
  max?: number
  default: number
}

export const QuantityTracker = (props: Props) => {
  const dispatch = useDispatch()
  const { count } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    dispatch(setCount(props.default))
  }, [])

  const MAX = props.max !== undefined ? props.max : Number.MAX_SAFE_INTEGER

  const subFromCount = () => {
    if (count !== 0) {
      dispatch(setCount(count - 1))
    }
  }

  const addToCount = () => {
    if (count < MAX) {
      dispatch(setCount(count + 1))
    }
  }

  return (
    <CounterContainer>
      <MinusButton onClick={subFromCount} />
      <ValueContainer>{count}</ValueContainer>
      <PlusButton isAdding={true} onClick={addToCount} max={MAX} />
    </CounterContainer>
  )
}
