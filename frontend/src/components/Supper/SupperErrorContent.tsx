import React from 'react'

import styled from 'styled-components'
import NotFoundCatImg from '../../assets/notFound.svg'

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NotFoundImg = styled.img`
  height: 168px;
  width: 168px;
`

const NotFoundText = styled.h1`
  width: 80vw;
  text-align: center;
`

export const SupperErrorContent = ({ errorText }: { errorText?: string }) => {
  return (
    <NotFoundContainer>
      <NotFoundImg src={NotFoundCatImg} />
      <NotFoundText>{errorText ?? 'sorry! meowmeow cant find your order'}</NotFoundText>
    </NotFoundContainer>
  )
}
