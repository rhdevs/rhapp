import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import { getUpdateMockString } from '../../store/home/action'
import { RootState } from '../../store/types'
<<<<<<< HEAD
<<<<<<< HEAD
import DropDownBar from '../../components/dropdown'
import picture from '../../assets/trial.svg'
import tree from '../../assets/tree.svg'
import { BasicCard } from '../../components/basiccard/test2'
import { LaundryPage } from '../../components/laundrypage/test'
import { FacilityBooking } from '../../components/LaundryCards/template'
import Selector from '../../components/Selector'
=======
import DropDownBar from '../../components/DropdownBar'
=======
import DropDownBar from '../../components/DropDownbar'
>>>>>>> b3181697... Changed variable names and file names
import { FacilityBooking } from '../../components/LaundryCards/template'

>>>>>>> ba1af377... Create Template for laundry card w/o btn
const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #fafaf4;
`

export default function Home() {
  const dispatch = useDispatch()
  const { sampleStateText } = useSelector((state: RootState) => state.home)

  useEffect(() => {
    //do smth @ the start
  }, [dispatch])

  const leftIcon = <button>Hello</button>

  const onButtonClick = () => {
    dispatch(getUpdateMockString())
  }

  return (
    <MainContainer>
<<<<<<< HEAD
      <Selector SelectedValue={'Choose your block'} ValueArray={['1', '2', '3', '4']} />
=======
      <Dropdownbar MenuTitle={'Choose your level'} MenuArray={['Level 1', 'Level 2', 'Level 3']} />
      <Dropdownbar MenuTitle={'Choose your block'} MenuArray={['Blk 2', 'Blk 3', 'Blk 4']} />
>>>>>>> b3181697... Changed variable names and file names
      <TopNavBar title={'NavBarTitle'} leftIconComponent={leftIcon} />
      <button onClick={onButtonClick}>{sampleStateText}</button>
<<<<<<< HEAD
      <LaundryPage />
      <BasicCard />
=======
>>>>>>> ba1af377... Create Template for laundry card w/o btn
      <FacilityBooking title={'In Use'} subtitle={'123'} colour={'red'} />
    </MainContainer>
  )
}
