import styled from 'styled-components'
import React from 'react'
import { ClickableDateContainer } from './ClickableDateContainer'

const DayContainer = styled.div`
  font-weight: 600;
  font-size: 13px;
  text-align: center;
`

export const MiddleDateRows = (firstDate: number) => {
  return (
    <>
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
    </>
  )
}
