import React, { ReactElement } from 'react'
import { useHistory } from 'react-router-dom'
import { NavBar, Icon } from 'antd-mobile'
import styled from 'styled-components'

import 'antd-mobile/dist/antd-mobile.css'

const TitleText = styled.p`
  margin: 0;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  width: 100%;
  line-height: 14px;
  color: #002642;
  align-self: center;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const StyledNavBar = styled(NavBar)`
  &.am-navbar {
    height: 70px;
    background-color: #fafaf4; !important
  }
  padding: 15px;
  max-width:100%;
  position: sticky;
  top:0;
  z-index:200;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  centerComponent,
  onLeftClick,
}: {
  title?: string
  leftIcon?: boolean
  leftIconComponent?: ReactElement
  rightComponent?: ReactElement | undefined
  centerComponent?: ReactElement
  onLeftClick?: () => void
}) {
  const history = useHistory()
  return (
    <StyledNavBar
      mode="light"
      icon={
        <>
          {leftIcon && leftIconComponent}
          {!leftIcon && (
            <NavBarIcons
              type="left"
              onClick={() => {
                onLeftClick ? onLeftClick() : history.goBack()
              }}
              color="#002642"
            />
          )}
          <TitleText>{title}</TitleText>
        </>
      }
      rightContent={rightComponent}
    >
      {centerComponent}
    </StyledNavBar>
  )
}

export default TopNavBar
