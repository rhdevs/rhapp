import React from 'react'
import { MinusCircleFilled } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { useEffect } from 'react'
import { setCount } from '../../store/supper/action'

type Props = {
  color?: string
  defaultValue?: number
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const MinusButton = (props: Props) => {
  const DARK_BLUE = '#002642'
  const LIGHT_RED = '#EB5757'
  const SHADED_RED = 'rgba(235, 87, 87, 0.5)'
  const SHADED_DARK_BLUE = 'rgba(0,38,66, 0.5)'
  const dispatch = useDispatch()
  const { count } = useSelector((state: RootState) => state.supper)

  useEffect(() => {
    dispatch(setCount(props.defaultValue))
  }, [dispatch])

  let BUTTON_COLOR = LIGHT_RED
  if (props.color === 'DARK_BLUE') {
    BUTTON_COLOR = DARK_BLUE
  }

  if (count === 0) {
    if ((BUTTON_COLOR = LIGHT_RED)) {
      BUTTON_COLOR = SHADED_RED
    }
    if ((BUTTON_COLOR = DARK_BLUE)) {
      BUTTON_COLOR = SHADED_DARK_BLUE
    }
  }

  return (
    <>
      <MinusCircleFilled
        style={{
          color: BUTTON_COLOR, //'#EB5757'
          fontSize: '25px',
        }}
        onClick={props.onClick}
      />
    </>
  )
}
