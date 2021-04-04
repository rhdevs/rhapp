import React from 'react'
<<<<<<< .merge_file_MViALz
import { RedButton } from './RedButton'
=======

import { BottomStickyButton } from './BottomStickyButton'
>>>>>>> .merge_file_KOAng9

type Props = {
  numberOfItems: number
  currentTotal: string
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export const ViewCartButton = (props: Props) => {
  const LEFT_TEXT = 'View Cart'
  const MIDDLE_TEXT = props.numberOfItems === 1 ? `${props.numberOfItems} item` : `${props.numberOfItems} items`
  const RIGHT_TEXT = `$${props.currentTotal}`

  return (
    <RedButton isSticky onClick={props.onClick} leftText={LEFT_TEXT} middleText={MIDDLE_TEXT} rightText={RIGHT_TEXT} />
  )
}
