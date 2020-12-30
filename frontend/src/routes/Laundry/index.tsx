import React from 'react'
import TopNavBar from '../../components/Mobile/TopNavBar'
import styled from 'styled-components'
import DropDownSelector from '../../components/Mobile/DropDownSelector'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import WashingMachineCard from '../../components/Laundry/WashingMachineCard'
import { WashingMachineListStub } from '../../store/stubs'
import { WashingMachine } from '../../store/laundry/types'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4; !important
`

const FilterGroup = styled.div`
  justify-content: space-between;
  display: flex;
  padding: 23px;
`

export default function ViewBooking() {
  return (
    <>
      <MainContainer>
        <TopNavBar title={'Laundry Time'} />
        <FilterGroup>
          <DropDownSelector SelectedValue={'Choose your block'} ValueArray={['2', '3']} />
          <DropDownSelector SelectedValue={'Choose your level'} ValueArray={['2', '3']} />
        </FilterGroup>
        {WashingMachineListStub.map((item: WashingMachine) => (
          <WashingMachineCard key={item.machineId} washingMachine={item} />
        ))}

        <BottomNavBar />
      </MainContainer>
    </>
  )
}
