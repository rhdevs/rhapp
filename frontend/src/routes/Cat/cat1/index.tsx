import { Button } from 'antd-mobile'
import React from 'react'
import TopNavBar from '../../../components/Mobile/TopNavBar'

export default function Cat1({
  handleIncreasePussyCount,
  handleDecreasePussyCount,
}: {
  handleIncreasePussyCount: () => void
  handleDecreasePussyCount: () => void
}) {
  return (
    <div>
      <TopNavBar title={`Cat 1`} />

      <Button onClick={handleIncreasePussyCount}>Reproduce</Button>
      <Button onClick={handleDecreasePussyCount}>Commit suicide</Button>
    </div>
  )
}
