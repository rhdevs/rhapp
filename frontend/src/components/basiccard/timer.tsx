import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { differenceInSeconds, differenceInMinutes, isSameSecond } from 'date-fns'
import { check } from 'prettier'
import '../../assets/fonts.css'

const Timer = ({
  destination,
  activate,
  caption,
  onlyMinutes,
  elapsed,
}: {
  destination: Date
  activate: any
  caption: boolean
  onlyMinutes: boolean
  elapsed: boolean
}) => {
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
  const mins = elapsed
    ? _.padStart((-differenceInMinutes(destination, current)).toString(), 2, '0')
    : _.padStart(differenceInMinutes(destination, current).toString(), 2, '0')
  const secs = _.padStart((differenceInSeconds(destination, current) % 60).toString(), 2, '0')
  return (
    <div>
      <p className={caption ? 'laundry-timer' : 'card-timer'}>
        {elapsed
          ? `(${mins} mins)`
          : onlyMinutes
          ? parseInt(mins) < 1
            ? 'Less than a minute left'
            : `${mins} minutes left`
          : caption
          ? `${mins} : ${secs}`
          : `${mins}:${secs}`}
      </p>
      {caption && (
        <p className="timer-caption">
          {'minutes'} &nbsp; &nbsp;
          {'seconds'}
        </p>
      )}
    </div>
  )
}

export { Timer }
