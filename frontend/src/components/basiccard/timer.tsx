import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { differenceInSeconds, differenceInMinutes, isSameSecond } from 'date-fns'
import { check } from 'prettier'

const Timer = ({ destination, activate }: { destination: Date; activate: any }) => {
  useEffect(() => {
    let mounted = true
    if (mounted) {
      setTimeout(() => {
        setCurrent(new Date())
        if (isSameSecond(current, destination)) {
          activate()
          mounted = false
        }
      }, 1000)
    }
  })

  const [current, setCurrent] = useState(new Date())
  const mins = differenceInMinutes(destination, current).toString()
  const secs = _.padStart((differenceInSeconds(destination, current) % 60).toString(), 2, '0')
  return (
    <div>
      <p>{`${mins} : ${secs}`}</p>
    </div>
  )
}

export { Timer }
