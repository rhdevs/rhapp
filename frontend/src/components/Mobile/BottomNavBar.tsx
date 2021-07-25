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
import supperIconSelected from '../../assets/supper/supperIconSelected.png'
import supperIconUnselected from '../../assets/supper/supperIconUnselected.png'
import 'antd-mobile/dist/antd-mobile.css'
import { V1_BACKGROUND, V1_RED } from '../../common/colours'

const StyledButton = styled.img`
  width: 28px;
  max-height: 28px;
`

const BottomNav = styled.div`
  z-index: 800;
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
    if (pathname.startsWith('/supper')) {
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
    <div style={{ height: '50px', backgroundColor: `${V1_BACKGROUND}` }}>
      <BottomNav>
        <TabBar unselectedTintColor="#949494" tintColor={V1_RED} barTintColor="white">
          <TabBar.Item
            key="Home"
            title="Home"
            icon={<StyledButton src={homeIconUnselected} />}
            selectedIcon={<StyledButton src={homeIconSelected} />}
            selected={activeTabIndex() === 1}
            // badge={0}
            onPress={() => {
              history.push(PATHS.HOME_PAGE)
            }}
          ></TabBar.Item>
          <TabBar.Item
            key="Facilities"
            title="Facilities"
            icon={<StyledButton src={facilitiesIconUnselected} />}
            selectedIcon={<StyledButton src={facilitiesIconSelected} />} //not available yet
            selected={activeTabIndex() === 2}
            // badge={12}
            onPress={() => {
              history.push(PATHS.FACILITY_BOOKING_MAIN)
            }}
          ></TabBar.Item>
          {/* <TabBar.Item
            key="Calender"
            title="Calender"
            icon={<StyledButton src={calenderIconUnselected} />}
            selectedIcon={<StyledButton src={calenderIconSelected} />}
            selected={activeTabIndex() === 3}
            // badge={'test'}
            onPress={() => {
              history.push(PATHS.SCHEDULE_PAGE)
            }}
          ></TabBar.Item> */}
          <TabBar.Item
            key="Supper"
            title="Supper"
            icon={<StyledButton src={supperIconUnselected} />}
            selectedIcon={<StyledButton src={supperIconSelected} />}
            selected={activeTabIndex() === 3}
            // badge={'test'}
            onPress={() => {
              history.push(PATHS.SUPPER_HOME)
            }}
          ></TabBar.Item>
          <TabBar.Item
            key="Profile"
            title="Profile"
            icon={<StyledButton src={profileIconUnselected} />}
            selectedIcon={<StyledButton src={profileIconSelected} />}
            selected={activeTabIndex() === 4}
            // badge={1}
            onPress={() => {
              history.push(PATHS.PROFILE_PAGE + `${localStorage.getItem('userID')}`)
            }}
          ></TabBar.Item>
        </TabBar>
      </BottomNav>
    </div>
  )
}

export default BottomNavBar
