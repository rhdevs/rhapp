import React from 'react'

import styled from 'styled-components'
import telegram_black from '../../assets/telegram_black.svg'

const Button = styled.img`
  width: 40px;
`

type Props = {
  url: string
  text: string
}

export const SGTelegramShareButton = (props: Props) => {
  const onClick = () => {
    const link = `https://t.me/share/url?url=${props.url}&text=${props.text}`

    window.open(link)
  }
  return <Button src={telegram_black} alt="tele button" onClick={onClick} />
}
