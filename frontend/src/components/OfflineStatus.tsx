import React from 'react'
import useSnackbar from '../hooks/useSnackbar'

export const OfflineStatus = () => {
  const [success] = useSnackbar('success')
  const [error] = useSnackbar('error')

  window.addEventListener('online', () => {
    triggerAlert(false)
  })

  window.addEventListener('offline', () => {
    triggerAlert(true)
  })

  const triggerAlert = (e: boolean) => {
    if (!e) {
      success('You are back online!')
    } else {
      error('You are using the app offline!')
    }
  }

  return <></>
}
