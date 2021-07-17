import React from 'react'

import { RedButton } from './RedButton'

type Props = {
  htmlType?: 'button' | 'submit' | 'reset' | undefined
  update?: boolean
  add?: boolean
  remove?: boolean
  width?: string
  leftText?: string
  currentTotal: string
  isGrey?: boolean
  isDisabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
export const AddUpdateCartButton = (props: Props) => {
  const LEFT_TEXT = props.update
    ? 'Update Cart'
    : props.add
    ? 'Add to Cart'
    : props.remove
    ? 'Remove Item'
    : props.leftText
  const RIGHT_TEXT = `$${props.currentTotal}`

  return (
    <RedButton
      {...((props.add || props.remove) && { zIndex: 0 })}
      isGrey={props.isGrey ?? props.isDisabled}
      htmlType={props.htmlType}
      width={props.width ?? '100%'}
      onClick={props.isDisabled ? undefined : props.onClick}
      leftText={LEFT_TEXT}
      rightText={RIGHT_TEXT}
    />
  )
}
