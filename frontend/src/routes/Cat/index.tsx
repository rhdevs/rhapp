import React, { useState } from 'react'
import 'antd/dist/antd.css'
import TopNavBar from '../../components/Mobile/TopNavBar'
import { Button } from 'antd-mobile'
import Cat1 from './cat1'
import Cat2 from './cat2'

export default function Cat() {
  const [catCount, setCatCount] = useState(3)
  const [displayCatNumber, setDisplayCatNumber] = useState(0)
  const [isCatCountSingular, setIsCatCountSingular] = useState(false)

  const handleIncreasePussyCount = () => {
    setCatCount(catCount + 1)
    handleCatCountSingular(catCount + 1)
  }

  const handleDecreasePussyCount = () => {
    setCatCount(catCount - 1)
    handleCatCountSingular(catCount - 1)
  }

  const handleCatCountSingular = (newCount: number) => {
    console.log('[catCount] count is: ', catCount)
    if (newCount === 1) {
      setIsCatCountSingular(true)
    } else {
      setIsCatCountSingular(false)
    }
  }

  return (
    <div>
      <TopNavBar title={`${catCount} Cat${!isCatCountSingular ? 's' : ''} Only`} />
      <Button onClick={handleIncreasePussyCount}>Click to increase pussy count</Button>
      <Button onClick={handleDecreasePussyCount}>Click to decrease pussy count</Button>

      <Button onClick={() => setDisplayCatNumber(0)}>Hide all Cats</Button>
      <Button onClick={() => setDisplayCatNumber(1)}>Go to Cat 1</Button>
      <Button onClick={() => setDisplayCatNumber(2)}>Go to Cat 2</Button>

      {displayCatNumber === 1 && (
        <div>
          <Cat1
            handleIncreasePussyCount={handleIncreasePussyCount}
            handleDecreasePussyCount={handleDecreasePussyCount}
          />
        </div>
      )}

      {displayCatNumber === 2 && (
        <div>
          <Cat2
            handleIncreasePussyCount={handleIncreasePussyCount}
            handleDecreasePussyCount={handleDecreasePussyCount}
          />
        </div>
      )}
    </div>
  )
}
