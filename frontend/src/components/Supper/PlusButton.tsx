import React from 'react'
import { PlusCircleFilled } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { V1_BLUE, V1_RED } from '../../common/colours'

type Props = {
  color?: string
  isAdding?: boolean
  max?: number
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const PlusButton = (props: Props) => {
  const SHADED_RED = 'rgba(235, 87, 87, 0.5)'
  const CREATE_SIZE = '48.7px'
  const COUNTING_SIZE = '25px'

  const { count } = useSelector((state: RootState) => state.supper)

  let BUTTON_COLOR = V1_RED
  let BUTTON_SIZE = CREATE_SIZE
  let SHADOW_FILTER = 'drop-shadow(2px 2.5px 3px rgba(0, 0, 0, 0.15))'

  const MAX = props.max !== undefined ? props.max : Math.max()

  if (props.isAdding === true) {
    BUTTON_SIZE = COUNTING_SIZE
    SHADOW_FILTER = ''
    if (count >= MAX) {
      BUTTON_COLOR = SHADED_RED
    }
  }

  if (props.color === 'DARK_BLUE') {
    BUTTON_COLOR = V1_BLUE
  }

  return (
    <PlusCircleFilled
      style={{
        color: BUTTON_COLOR,
        fontSize: BUTTON_SIZE,
        filter: SHADOW_FILTER,
      }}
      onClick={props.onClick}
      max={MAX}
    />
  )
}
