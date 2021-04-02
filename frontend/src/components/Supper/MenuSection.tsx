import React from 'react'
import styled from 'styled-components'

const MainContainer = styled.div`
  background-color: white;
  margin: 20px 0;
`

const SectionHeaderContainer = styled.div`
  padding: 10px 20px;
`

const SectionHeader = styled.text`
font
`

const SectionBodyContainer = styled.div``

export const MenuSection = () => {
  return (
    <MainContainer>
      <SectionHeaderContainer>
        <SectionHeader>Value Meals</SectionHeader>
      </SectionHeaderContainer>
      <SectionBodyContainer></SectionBodyContainer>
    </MainContainer>
  )
}
