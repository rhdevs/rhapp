import React from 'react'

import styled from 'styled-components'
import { MainCard } from './MainCard'
import { InfoCircleOutlined } from '@ant-design/icons'

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
  return (
    <MainCard margin="20px ;" borderRadius="10px" padding="20px 10px;">
      <SymbolContainer>
        <InformationSymbol />
      </SymbolContainer>
      <InformationContainer>
        <InformationText>{props.content}</InformationText>
      </InformationContainer>
    </MainCard>
  )
}
