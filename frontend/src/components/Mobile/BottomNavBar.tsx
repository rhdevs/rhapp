import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../routes/Routes'
import { TabBar } from 'antd-mobile'
import { useLocation } from 'react-router-dom'
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
  z-index: 1000;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  width: 100%;
`

function BottomNavBar() {
  const history = useHistory()
  const location = useLocation()

  const activeTabIndex = () => {
    const pathname = location.pathname
    if (pathname.startsWith('/schedule')) {
      return 3
    } else if (pathname.startsWith('/facility')) {
      return 2
    } else if (pathname === '/') {
      return 1
    } else if (pathname.startsWith('/social') || pathname.startsWith('/auth')) {
      return 4
    }
  }

  return (
    <div style={{ height: '55px', backgroundColor: '#fafaf4' }}>
      <BottomNav>
        <TabBar unselectedTintColor="#949494" tintColor="#33A3F4" barTintColor="white">
          <TabBar.Item
            key="Home"
            icon={<StyledButton src={homeIconUnselected} />}
            selectedIcon={<StyledButton src={homeIconSelected} />}
            selected={activeTabIndex() === 1}
            // badge={0}
            onPress={() => {
              history.push(PATHS.HOME_PAGE)
              console.log(location.pathname)
            }}
          ></TabBar.Item>
          <TabBar.Item
            key="Facilities"
            icon={<StyledButton src={facilitiesIconUnselected} />}
            selectedIcon={<StyledButton src={facilitiesIconSelected} />} //not available yet
            selected={activeTabIndex() === 2}
            // badge={12}
            onPress={() => {
              history.push(PATHS.FACILITY_BOOKING_MAIN)
            }}
          ></TabBar.Item>
          <TabBar.Item
            key="Calender"
            icon={<StyledButton src={calenderIconUnselected} />}
            selectedIcon={<StyledButton src={calenderIconSelected} />}
            selected={activeTabIndex() === 3}
            // badge={'test'}
            onPress={() => {
              history.push(PATHS.SCHEDULE_PAGE)
            }}
          ></TabBar.Item>
          <TabBar.Item
            key="Profile"
            icon={<StyledButton src={profileIconUnselected} />}
            selectedIcon={<StyledButton src={profileIconSelected} />}
            selected={activeTabIndex() === 4}
            // badge={1}
            onPress={() => {
              history.push(PATHS.PROFILE_PAGE)
            }}
          ></TabBar.Item>
        </TabBar>
      </BottomNav>
    </div>
  )
}

export default BottomNavBar
