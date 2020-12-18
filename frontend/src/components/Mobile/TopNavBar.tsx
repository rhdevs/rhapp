import React, { ReactElement } from 'react'
import { NavBar, Icon } from 'antd-mobile'
import styled from 'styled-components'

import 'antd-mobile/dist/antd-mobile.css'

const TitleText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 14px;
  color: #002642;
  align-self: center;
  white-space: nowrap;
`
const StyledNavBar = styled(NavBar)`
  &.am-navbar {
    height: 70px;
    background-color: #fafaf4; !important
  }
  padding: 15px;
  max-width:100%;
`
const NavBarIcons = styled(Icon)`
  &.am-icon-md {
    width: 28px;
    height: 28px;
  }
  padding-right: 11px;
  width: 40px;
  height: 40px;
`
// UNDONE, feel free to complete
function TopNavBar({
  title,
  leftIcon,
  leftIconComponent,
  rightComponent,
}: {
  title: string
  leftIcon?: boolean
  leftIconComponent?: ReactElement
  rightComponent?: ReactElement
}) {
  return (
    <StyledNavBar
      mode="light"
      icon={
        <>
          {leftIcon && leftIconComponent}
          {!leftIcon && (
            <NavBarIcons
              type="left"
              // onClick={() => {
              //   console.log('goback')
              // }}
              color="#002642"
            />
          )}
          <TitleText>{title}</TitleText>
        </>
      }
      onLeftClick={() => console.log('onLeftClick')}
      rightContent={rightComponent}
    ></StyledNavBar>
  )
}

export default TopNavBar
