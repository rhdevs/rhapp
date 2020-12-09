import React, { ReactElement, useState } from 'react'

import { Menu } from 'antd'

import { ReactComponent as MenuIcon } from '../../assets/MenuButtonIcon.svg'
import styled from 'styled-components'

const MenuContainer = styled.div`
  display: flex;
  flex-direction: vertical;
  justify-content: flex-end;
`

type Props = {
  menuItem: ReactElement
  icon?: ReactElement
}

function MenuDropdown(props: Props) {
  const [menuIsVisible, setMenuIsVisible] = useState(false)

  const toggleMenu = () => {
    setMenuIsVisible(!menuIsVisible)
    console.log(menuIsVisible)
  }

  return (
    <MenuContainer>
      <div onClick={toggleMenu}>{props.icon ?? <MenuIcon />}</div>
      {menuIsVisible && (
        <Menu style={{ width: 256, position: 'absolute', top: '60px', right: 0 }} mode="inline">
          {props.menuItem}
        </Menu>
      )}
    </MenuContainer>
  )
}

export default MenuDropdown
