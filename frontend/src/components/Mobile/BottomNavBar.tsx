import React from 'react'
import styled from 'styled-components'
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

function BottomNavBar() {
  return (
    <TabBar unselectedTintColor="#949494" tintColor="#33A3F4" barTintColor="white">
      <TabBar.Item
        key="Home"
        icon={<StyledButton src={homeIconUnselected} />}
        selectedIcon={<StyledButton src={homeIconSelected} />}
        selected={true}
        badge={0}
        // onPress={}
      ></TabBar.Item>
      <TabBar.Item
        key="Facilities"
        icon={<StyledButton src={facilitiesIconUnselected} />}
        selectedIcon={<StyledButton src={facilitiesIconSelected} />} //not available yet
        selected={false}
        badge={12}
        // onPress={}
      ></TabBar.Item>
      <TabBar.Item
        key="Calender"
        icon={<StyledButton src={calenderIconUnselected} />}
        selectedIcon={<StyledButton src={calenderIconSelected} />}
        selected={false}
        badge={'test'}
        // onPress={}
      ></TabBar.Item>
      <TabBar.Item
        key="Profile"
        icon={<StyledButton src={profileIconUnselected} />}
        selectedIcon={<StyledButton src={profileIconSelected} />}
        selected={false}
        badge={1}
        // onPress={}
      ></TabBar.Item>
    </TabBar>
  )
}

export default BottomNavBar
