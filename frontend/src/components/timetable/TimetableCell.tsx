import React, { ReactElement } from 'react'
import styled from 'styled-components'

const TimetableCellContainer = styled.div`
  width: 8rem;
  min-height: 67px;
`

function TimetableCell({ isGreyCellColor, children }: { isGreyCellColor: boolean; children?: ReactElement }) {
  return (
    <TimetableCellContainer style={{ backgroundColor: isGreyCellColor ? '#f3f5f8' : '#fff' }}>
      {children}
    </TimetableCellContainer>
  )
}

export default TimetableCell
