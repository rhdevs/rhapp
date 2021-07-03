type Props = {
  url: string
  text: string
}

export const teleShareWithText = (props: Props) => {
  const link = `https://t.me/share/url?url=${props.url}&text=${props.text}`

  window.open(link)
}

export const openUserTelegram = (telegramHandle: string) => {
  const site = 'https://telegram.me/' + telegramHandle
  return window.open(site)
}
