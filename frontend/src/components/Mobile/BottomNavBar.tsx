import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../routes/Routes'
import { TabBar } from 'antd-mobile'
import homeIconSelected from '../../assets/homeIconSelected.svg'
import homeIconUnselected from '../../assets/homeIconUnselected.svg'
import facilitiesIconSelected from '../../assets/facilitiesIconSelected.svg'
import facilitiesIconUnselected from '../../assets/facilitiesIconUnselected.svg'
import calenderIconSelected from '../../assets/calenderIconSelected.svg'
import calenderIconUnselected from '../../assets/calenderIconUnselected.svg'
import profileIconSelected from '../../assets/profileIconSelected.svg'
import profileIconUnselected from '../../assets/profileIconUnselected.svg'

const StyledButton = styled.img`
  width: 27px;
  height: 27px;
`

const BottomNav = styled.div`
  overflow: hidden;
  position: fixed;
  bottom: 0;
  width: 100%;
`

function BottomNavBar() {
  const history = useHistory()
  return (
    <BottomNav>
      <TabBar unselectedTintColor="#949494" tintColor="#33A3F4" barTintColor="white">
        <TabBar.Item
          key="Home"
          icon={<StyledButton src={homeIconUnselected} />}
          selectedIcon={<StyledButton src={homeIconSelected} />}
          selected={true}
          // badge={0}
          onPress={() => {
            history.push(PATHS.HOME_PAGE)
          }}
        ></TabBar.Item>
        <TabBar.Item
          key="Facilities"
          icon={<StyledButton src={facilitiesIconUnselected} />}
          selectedIcon={<StyledButton src={facilitiesIconSelected} />} //not available yet
          selected={false}
          // badge={12}
          onPress={() => {
            history.push(PATHS.FACILITY_BOOKING_MAIN)
          }}
        ></TabBar.Item>
        <TabBar.Item
          key="Calender"
          icon={<StyledButton src={calenderIconUnselected} />}
          selectedIcon={<StyledButton src={calenderIconSelected} />}
          selected={false}
          // badge={'test'}
          onPress={() => {
            history.push(PATHS.SCHEDULE_PAGE)
          }}
        ></TabBar.Item>
        <TabBar.Item
          key="Profile"
          icon={<StyledButton src={profileIconUnselected} />}
          selectedIcon={<StyledButton src={profileIconSelected} />}
          selected={false}
          // badge={1}
          onPress={() => {
            history.push(PATHS.PROFILE_PAGE)
          }}
        ></TabBar.Item>
      </TabBar>
    </BottomNav>
  )
}

export default BottomNavBar
