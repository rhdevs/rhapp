import React from 'react'
import styled from 'styled-components'

const BannerContainer = styled.div`
  border-radius: 0px 0px 7px 7px;
  background-color: #de5f4c;
`
type props = {
  text: string
}

function NavBar({ text }: props) {
  return (
    <BannerContainer>
      <h1 style={{ color: '#fafaf4', padding: '7px' }}>{text}</h1>
    </BannerContainer>
  )
}

export default NavBar
