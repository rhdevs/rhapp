import React from 'react'
import { MinusCircleFilled } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/types'

type Props = {
  color?: string
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const MinusButton = (props: Props) => {
  const DARK_BLUE = '#002642'
  const LIGHT_RED = '#EB5757'
  const SHADED_RED = 'rgba(235, 87, 87, 0.5)'

  const { count } = useSelector((state: RootState) => state.supper)

  let BUTTON_COLOR = LIGHT_RED

  if (count === 0) {
    BUTTON_COLOR = SHADED_RED
  }

  if (props.color === 'DARK_BLUE') {
    BUTTON_COLOR = DARK_BLUE
  }

  return (
    <MinusCircleFilled
      style={{
        color: BUTTON_COLOR, //'#EB5757'
        fontSize: '25px',
      }}
      onClick={props.onClick}
    />
  )
}
