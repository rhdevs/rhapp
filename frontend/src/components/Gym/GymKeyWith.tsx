import React from 'react'
import styled from 'styled-components'
import Avatar from '../../assets/Avatar_4x.png'
import { openUserTelegram } from '../../common/telegramMethods'
import { LAPTOP_VIEW } from '../../common/breakpoints'

const Header = styled.h2`
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 20px;
  text-align: center;
  color: #000000;
  padding: 30px;
  margin: 0;
`

const InfoArea = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #191919;
`

const Container = styled.div`
  padding-top: 20px;
  margin-bottom: 20px;
`

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  ${LAPTOP_VIEW} {
    img {
      width: 120px;
    }
  }
`

interface Props {
  name: string
  handle: string
  avatar?: string
}

/**
 *
 * @param name (string)
 * @param handle (string) user's telegram handle
 * @param avatar (string, optional) user's profile picture. The string is of the form url 
 * @returns user's profile picture, name and link to his/her telegram
 *
 * @example
 * user called Shaun and has no profile picture
 * component will display the default profile picture, his name Shaun as well as his
 * telegram handle. Clicking on the telegram handle redirects the user to key holder's telegram
 * <GymKeyWith name={"thomaslim"} handle={"@thomas123"} avatar={""} />
 *
 */

function GymKeyWith(props: Props) {
  return (
    <>
      <Header>Key With</Header>
      <ImageContainer>
        <img
          src={props.avatar === '' ? Avatar : props.avatar}
          style={{ height: 100, width: 100, objectFit: 'cover', borderRadius: 100 / 2 }}
          alt="Avatar"
          width="20%"
        />
      </ImageContainer>
      <Container>
        <InfoArea> {props.name} </InfoArea>
        <InfoArea onClick={() => openUserTelegram(props.handle)}>{'@' + props.avatar}</InfoArea>
      </Container>
    </>
  )
}

GymKeyWith.defaultProps = {
  avatar: '',
}

export default GymKeyWith
