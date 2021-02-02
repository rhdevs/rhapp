import React, { useEffect } from 'react'
import TopNavBar from '../../components/Mobile/TopNavBar'
import styled from 'styled-components'
import DropDownSelector from '../../components/Mobile/DropDownSelector'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import WashingMachineCard from '../../components/Laundry/WashingMachineCard'
import { WashingMachine } from '../../store/laundry/types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { getLocationList, SetBlockLevelSelections } from '../../store/laundry/action'
import LoadingSpin from '../../components/LoadingSpin'

const MainContainer = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #fafaf4; !important
`

const FilterGroup = styled.div`
  justify-content: space-between;
  display: flex;
  padding: 23px;
  padding-bottom: 0px;
`

export default function LaundryMain() {
  const dispatch = useDispatch()
  const { blocks, levels, isLoading, selectedBlock, filteredMachines, selectedLevel } = useSelector(
    (state: RootState) => state.laundry,
  )

  useEffect(() => {
    dispatch(getLocationList())
  }, [dispatch])

  return (
    <>
      <MainContainer>
        <TopNavBar title={'Laundry Time'} />
        <FilterGroup>
          <DropDownSelector
            SelectedValue={selectedBlock === '' ? 'Block' : (selectedBlock as string)}
            ValueArray={blocks}
            handleChange={(newBlock) => dispatch(SetBlockLevelSelections(newBlock, ''))}
          />
          {selectedBlock !== 'Kuok' && (
            <DropDownSelector
              SelectedValue={selectedLevel === '' ? 'Block' : (selectedLevel as string)}
              ValueArray={levels}
              handleChange={(newLevel) => dispatch(SetBlockLevelSelections('', newLevel))}
            />
          )}
        </FilterGroup>
        {isLoading && <LoadingSpin />}
        {selectedLevel === null && selectedBlock !== 'Kuok' && (
          <h4 style={{ textAlign: 'center', padding: '23px' }}>Select Both Your Block and Level!</h4>
        )}
        {!isLoading &&
          filteredMachines.map((item: WashingMachine) => (
            <WashingMachineCard key={item.machineID} washingMachine={item} />
          ))}
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
