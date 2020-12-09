import React from 'react'
import 'antd-mobile/dist/antd-mobile.css'
import styled from 'styled-components'
import calendarIcon from '../../assets/calendarIcon.svg'
import profileIcon from '../../assets/profileIcon.svg'
import homeIcon from '../../assets/homeIcon.svg'
import { DESKTOP_VIEW, TABLET_VIEW } from '../../common/breakpoints'
import { useHistory } from 'react-router-dom'

const BottomBarContainer = styled.div`
  bottom: 0;
  z-index: 999;
  background-color: #ffffff;
  position: absolute;
  width: 100%;
  display: -ms-flexbox;
  display: flex;
  height: 64px;

  ${TABLET_VIEW} {
    height: 40px;
  }

  ${DESKTOP_VIEW} {
    display: none;
  }
`

const Button = styled.div`
  padding: 0.67em;
  font-size: 2em;
  text-align: center;
  width: 24.9%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const ButtonIcon = styled.img`
  width: 37px;
  height: 37px;
  fill: #002642;
}
`

// UNDONE, feel free to complete
function BottomNavBar() {
  const history = useHistory()

  const handleClick = () => {
    history.push('/profile')
  }

  return (
    <BottomBarContainer>
      <Button>
        <ButtonIcon src={homeIcon} />
      </Button>
      <Button>2</Button>

      <Button>
        <ButtonIcon src={calendarIcon} />
      </Button>
      <Button onClick={handleClick}>
        <ButtonIcon src={profileIcon} />
      </Button>
    </BottomBarContainer>
  )
}

export default BottomNavBar
