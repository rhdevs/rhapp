import React, { ReactElement } from 'react'
import { useHistory } from 'react-router-dom'
import { NavBar, Icon } from 'antd-mobile'
import styled from 'styled-components'

import 'antd-mobile/dist/antd-mobile.css'

const TitleText = styled.h1`
  font-family: lato;
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 20px;
  color: #000000;
  align-self: center;
  white-space: nowrap;
  padding-left: 70px;
`

const StyledNavBar = styled(NavBar)`
  &.am-navbar {
    height: 70px;
    background-color: #ffffff; !important
  }
  max-width:100%;
  position: sticky;
  top:0;
  z-index: 200;
  display: flex;
  flex-direction: row;
  justify-content: right;
`

const NavBarIcons = styled(Icon)`
  &.am-icon-md {
    width: 40px;
    height: 40px;
    align-self: center;
  }
  padding-right: 11px;
  width: 40px;
  height: 40px;
`

type NavProps = {
  title?: string
  leftIcon?: boolean
  leftIconComponent?: ReactElement
  rightComponent?: ReactElement | undefined
  centerComponent?: ReactElement
  onLeftClick?: () => void
}

function TopNavBarRevamp(props: NavProps) {
  const history = useHistory()
  return (
    <StyledNavBar
      mode="light"
      icon={
        <>
          {props.leftIcon && props.leftIconComponent}
          {!props.leftIcon && (
            <NavBarIcons
              type="left"
              onClick={() => {
                props.onLeftClick ? props.onLeftClick() : history.goBack()
              }}
              color="#002642"
            />
          )}
          <TitleText>{props.title}</TitleText>
        </>
      }
      rightContent={props.rightComponent}
    >
      {props.centerComponent}
    </StyledNavBar>
  )
}

export default TopNavBarRevamp
