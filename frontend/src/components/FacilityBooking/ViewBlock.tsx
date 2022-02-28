import React from 'react'

import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import { StyledViewBooking, TextContainer } from './BlockStyles'

const ViewBlock = ({ entry }: { entry: TimeBlock }) => {
  return (
    <StyledViewBooking isOccupied={entry.type === TimeBlockType.OCCUPIED} blockId={entry.id}>
      {entry.type === TimeBlockType.OCCUPIED && (
        <TextContainer>
          {entry.ccaName}
          <br />
          {entry.eventName}
        </TextContainer>
      )}
    </StyledViewBooking>
  )
}
export default ViewBlock
