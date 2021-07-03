import { InfoCircleOutlined } from '@ant-design/icons'
import React from 'react'

import styled from 'styled-components'
import { MainCard } from './MainCard'

const SymbolContainer = styled.div`
  padding: 2px 10px 0 10px;
`

const InformationSymbol = styled(InfoCircleOutlined)`
  font-size: 15px;
`

const InformationContainer = styled.div`
  padding: 0 10px 0 0;
  overflow-wrap: anywhere;
`

const InformationText = styled.text``

type Props = {
  content: string
}

export const InformationCard = (props: Props) => {
  const shortText = 'This is a short text.'
  const longText =
    'Hello this is a notification or an instruction box I think it can be both I am trying to make this message real long to test out and see if it still looks nice so dun mind me, anyeong and move on with life thank you very much.'
  return (
    <MainCard margin="20px ;" borderRadius="10px" padding="20px 10px;">
      <SymbolContainer>
        <InformationSymbol />
      </SymbolContainer>
      <InformationContainer>
        <InformationText>{shortText}</InformationText>
      </InformationContainer>
    </MainCard>
  )
}
