import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { differenceInSeconds, differenceInMinutes, isSameSecond } from 'date-fns'
import { check } from 'prettier'
import '../../assets/fonts.css'
import styled from 'styled-components'

const LaundryTimer = styled.div`
  font-family: Inter;
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: 0em;
  color: #023666;
  margin-bottom: 15px;
  margin-top: 20px;
`

const TimerCaption = styled.div`
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  color: #023666;
`
const Elapsed = styled.div`
  margin-bottom: 0px;
  font-weight: 200;
  font-size: 14px;
`

const TimerConditionals = ({
  elapsed,
  mins,
  onlyMinutes,
  caption,
  secs,
}: {
  mins: string
  secs: string
  elapsed: boolean
  caption: boolean
  onlyMinutes: boolean
}) => {
  return (
    <div>
      {elapsed
        ? ` (${mins} mins)`
        : onlyMinutes
        ? parseInt(mins) < 1
          ? 'Less than a minute left'
          : `${mins} minutes left`
        : caption
        ? `${mins} : ${secs}`
        : `${mins}:${secs}`}
    </div>
  )
}

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
      {caption ? (
        <LaundryTimer>
          <TimerConditionals elapsed={elapsed} mins={mins} onlyMinutes={onlyMinutes} caption={caption} secs={secs} />
        </LaundryTimer>
      ) : elapsed ? (
        <Elapsed>
          {' '}
          <TimerConditionals elapsed={elapsed} mins={mins} onlyMinutes={onlyMinutes} caption={caption} secs={secs} />
        </Elapsed>
      ) : (
        <div>
          {' '}
          <TimerConditionals elapsed={elapsed} mins={mins} onlyMinutes={onlyMinutes} caption={caption} secs={secs} />
        </div>
      )}
      {caption && (
        <TimerCaption>
          {'minutes'} &nbsp; &nbsp;
          {'seconds'}
        </TimerCaption>
      )}
    </div>
  )
}

export { Timer }
