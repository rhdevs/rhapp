import React from 'react'

import styled from 'styled-components'
import telegram_black from '../assets/telegram_black.svg'
import { openUserTelegram } from '../common/telegramMethods'

const StyledIcon = styled.img<{ margin?: string; padding?: string; size?: string }>`
  ${(props) => props.margin && `margin: ${props.margin}`}
  ${(props) => props.padding && `padding: ${props.padding}`}
  ${(props) => props.size && `width: ${props.size}`}
  ${(props) => props.size && `height: ${props.size}`}
`

type Props = {
  telegramHandle: string
  margin?: string
  padding?: string
  size?: string
}

export const TelegramShareButton = (props: Props) => {
  return (
    <StyledIcon
      margin={props.margin}
      padding={props.padding}
      width={props.size}
      height={props.size}
      onClick={() => {
        openUserTelegram(props.telegramHandle)
      }}
      src={telegram_black}
      alt="Telegram Icon"
    />
  )
}
