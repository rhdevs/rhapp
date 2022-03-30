export const teleShareWithText = (url: string, text: string) => {
  const link = `https://t.me/share/url?url=${url}&text=${text}`

  window.open(link)
}

export const openUserTelegram = (telegramHandle: string) => {
  const site = 'https://telegram.me/' + telegramHandle
  window.open(site)
}
