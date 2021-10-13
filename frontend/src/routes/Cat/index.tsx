import React from 'react'
import 'antd/dist/antd.css'
import TopNavBar from '../../components/Mobile/TopNavBar'
import { Button } from 'antd-mobile'
import Cat1 from './cat1'
import Cat2 from './cat2'
import { DecreaseCatCount, IncreaseCatCount, SetDisplayCatNumber } from '../../store/cat/action'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'

export default function Cat() {
  const dispatch = useDispatch()
  const { catCount, isCatCountSingular, displayCatNumber } = useSelector((state: RootState) => state.cat)

  return (
    <div>
      <TopNavBar title={`${catCount} Cat${!isCatCountSingular ? 's' : ''} Only`} />
      <Button onClick={() => dispatch(IncreaseCatCount())}>Click to increase pussy count</Button>
      <Button onClick={() => dispatch(DecreaseCatCount())}>Click to decrease pussy count</Button>

      <Button onClick={() => dispatch(SetDisplayCatNumber(0))}>Hide all Cats</Button>
      <Button onClick={() => dispatch(SetDisplayCatNumber(1))}>Go to Cat 1</Button>
      <Button onClick={() => dispatch(SetDisplayCatNumber(2))}>Go to Cat 2</Button>

      {displayCatNumber === 1 && (
        <div>
          <Cat1
            handleIncreasePussyCount={() => dispatch(IncreaseCatCount())}
            handleDecreasePussyCount={() => dispatch(DecreaseCatCount())}
          />
        </div>
      )}
      {displayCatNumber === 2 && (
        <div>
          <Cat2
            handleIncreasePussyCount={() => dispatch(IncreaseCatCount())}
            handleDecreasePussyCount={() => dispatch(DecreaseCatCount())}
          />
        </div>
      )}
    </div>
  )
}
