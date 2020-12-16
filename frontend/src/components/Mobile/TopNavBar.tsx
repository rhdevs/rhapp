import React, { ReactElement } from 'react'
import { NavBar, Icon } from 'antd-mobile'
import styled from 'styled-components'
import 'antd-mobile/dist/antd-mobile.css'
import { ReactComponent } from '*.svg'

const TitleText = styled.text`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 14px;
  color: #002642;
`
const StyledNavBar = styled(NavBar)`
  &.am-navbar {
    height: 70px;
    background-color: #fafaf4; !important
  }
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
          {!leftIcon && <Icon type="left" color="#002642" />}
          <TitleText>{title}</TitleText>
        </>
      }
      onLeftClick={() => console.log('onLeftClick')}
      rightContent={rightComponent}
    ></StyledNavBar>
  )
}

export default TopNavBar
