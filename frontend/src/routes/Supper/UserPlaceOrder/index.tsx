import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'
import SearchBar from '../../../components/Mobile/SearchBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { ExpandableSGCard } from '../../../components/Supper/CustomCards/ExpandableSGCard'
import { MenuSection } from '../../../components/Supper/MenuSection'
import { MenuTabs } from '../../../components/Supper/MenuTabs'
import { AlAmaanStub } from '../../../store/stubs'
import { RootState } from '../../../store/types'

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: #fafaf4;
  position: relative;
`
const SearchBarContainer = styled.div`
  margin: 8px 20px;
`

const Restaurant = styled.text`
  font-weight: 700;
  font-size: 24px;
  margin-left: 30px;
`

export default function UserPlaceOrder() {
  return (
    <Background>
      <TopNavBar title="Place Order" />
      <ExpandableSGCard
        isOwner
        supperGroupName="SUPPER FRIENDS"
        supperGroupId="RHSO#1002"
        ownerName="Zhou BaoBao"
        priceLimit={30}
        currentAmount={10}
        closingTime="10.30PM"
        numberOfUsers={10}
        deliveryFee="10.70"
      />
      <Restaurant>{AlAmaanStub.name}</Restaurant>
      <SearchBarContainer>
        <SearchBar
          placeholder="Search for food"
          value={'Search for food'}
          onChange={() => {
            1
          }}
        />
        <MenuTabs menuSections={AlAmaanStub.allSection} />
        <MenuSection menu={AlAmaanStub.menu} />
      </SearchBarContainer>
    </Background>
  )
}
