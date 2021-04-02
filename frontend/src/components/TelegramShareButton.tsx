import React from 'react'
import Button from './Mobile/Button'

type Props = {
  url: string
  text: string
}

export const TelegramShareButton = (props: Props) => {
  const onClick = () => {
    const link = `https://t.me/share/url?url=${props.url}&text=${props.text}`

    window.open(link)
  }
  return <Button stopPropagation={true} defaultButtonDescription="Share" onButtonClick={onClick} isFlipButton={false} />
}

export const OpenUserTelegram = (telegramHandle: string) => {
  const site = 'https://telegram.me/' + telegramHandle
  return window.open(site)
}
