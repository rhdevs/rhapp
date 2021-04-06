import React from 'react'

import styled from 'styled-components'

const Logo = styled.img`
  max-height: 64px;
  max-width: 64px;
  width: 100%;
  height: auto;
  border: 1px #002642 solid;
  border-radius: 50%;
  overflow: hidden;
  min-width: 100%;
  min-height: 100%;
`

const ImgContainer = styled.div`
  height: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  min-height: 64px;
  min-width: 64px;
`

type Props = {
  image: string
  alt: string
}

export const RoundImage = (props: Props) => {
  return (
    <ImgContainer>
      <Logo src={props.image} alt={props.alt} />
    </ImgContainer>
  )
}
