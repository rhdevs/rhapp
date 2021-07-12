import React from 'react'

import styled from 'styled-components'
import { MainCard } from './MainCard'
import { InfoCircleOutlined } from '@ant-design/icons'

const SymbolContainer = styled.div`
  padding: 0 10px 0 0;
  display: flex;
  height: 15px;
`

const InformationSymbol = styled(InfoCircleOutlined)`
  font-size: 12px;
  height: fit-content;
  margin: auto;
`

const InformationContainer = styled.div`
  padding: 0;
  overflow-wrap: anywhere;
  display: flex;
  align-items: baseline;
`

const InformationText = styled.text`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  white-space: pre;
  color: #000000d9;
  white-space: pre-wrap;
`

const GreyItalicizedText = styled.i`
  color: #000000d9;
`

const SplitCostContent = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  display: flex;
  flex-direction: column;
  color: #000000d9;
`

type Props = {
  content?: string
  marginTop?: string | undefined
  marginBottom?: string | undefined
  margin?: string
  updateSummary?: boolean
  closeSupperGroup?: boolean
  cancelledSupperGroup?: boolean
  splitACMethod?: boolean
  disclaimer?: boolean
}

export const InformationCard = (props: Props) => {
  let content: string | JSX.Element | undefined = props.content
  if (props.updateSummary) {
    content =
      'Update summary to reflect any price differences or changes you made during the actual order (e.g. ordered something else, item was unavailable, price is different, delivery fee changed)'
  }
  if (props.closeSupperGroup) {
    content = 'Close supper group if you are ready to order'
  }
  if (props.cancelledSupperGroup) {
    content =
      'Looks like your supper group was cancelled! Fret not, you can always go back to the main page to join another supper group or start your own!'
  }
  if (props.splitACMethod) {
    content = (
      <SplitCostContent>
        <b>Example of fee splitting:</b>
        <br />
        <GreyItalicizedText>Jane’s subtotal: $10</GreyItalicizedText>
        <GreyItalicizedText>John’s subtotal: $2</GreyItalicizedText>
        <GreyItalicizedText>Total delivery fee: $3</GreyItalicizedText>
        <br />
        <b>a) Equally (splitting by pax)</b>
        <text>Jane’s delivery fee: 1/2 x $3 = $1.50</text>
        <br />
        <b>b) Proportionally (splitting by subtotal)</b>
        <text>Jane’s delivery fee: $10/12 x $3 = $2.50</text>
      </SplitCostContent>
    )
  }

  if (props.disclaimer) {
    content = 'Owner may contact you for alternatives if the item you have selected is unavailable'
  }
  return (
    <MainCard
      minHeight=""
      margin={props.margin ?? `${props.marginTop ?? '20px'} 20px ${props.marginBottom ?? '20px'} 20px`}
      borderRadius="10px"
      padding="15px 20px;"
    >
      <SymbolContainer>
        <InformationSymbol />
      </SymbolContainer>
      <InformationContainer>
        <InformationText>{content}</InformationText>
      </InformationContainer>
    </MainCard>
  )
}
