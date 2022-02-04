import React, { useState } from 'react'
import GymNavBar from '../../components/GymNavBar'
import GymStatus from '../../components/GymStatus'
import GymKeyWith from '../../components/GymKeyWith'

export default function GymPage() {
  return (
    <>
      <GymNavBar />
      <GymStatus isOpen />
      <GymKeyWith />
    </>
  )
}
