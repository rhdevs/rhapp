import React from 'react'

import styled from 'styled-components'
import SearchBar from '../../../components/Mobile/SearchBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { ExpandableSGCard } from '../../../components/Supper/CustomCards/ExpandableSGCard'
import { MenuSection } from '../../../components/Supper/MenuSection'
import { MenuTabs } from '../../../components/Supper/MenuTabs'
import { foodMenuStub } from '../../../store/stubs'

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
      <Restaurant>RestaurantName</Restaurant>
      <SearchBarContainer>
        <SearchBar
          placeholder="Search for food"
          value={'Search for food'}
          onChange={() => {
            1
          }}
        />
        <MenuTabs menuSections={['Thai Kitchen', 'Indian Kitchen', 'Western Kitchen']} />
        <MenuSection menu={foodMenuStub} />
      </SearchBarContainer>
    </Background>
  )
}
