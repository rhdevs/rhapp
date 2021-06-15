import React from 'react'
import { RedButton } from './RedButton'

type Props = {
  numberOfItems: number | undefined
  currentTotal: string | undefined | number
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const ViewCartButton = (props: Props) => {
  const LEFT_TEXT = 'View Cart'
  const MIDDLE_TEXT = props.numberOfItems === 1 ? `${props.numberOfItems} item` : `${props.numberOfItems ?? 0} items`
  const RIGHT_TEXT = `$${Number(props.currentTotal ?? 0).toFixed(2)}`

  return (
    <RedButton isSticky onClick={props.onClick} leftText={LEFT_TEXT} middleText={MIDDLE_TEXT} rightText={RIGHT_TEXT} />
  )
}
