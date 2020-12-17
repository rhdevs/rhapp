import React, { useState, useEffect } from 'react'
import laundry from '../../assets/laundryicon2.svg'
import { Timer } from '../basiccard/timer'
import 'antd/dist/antd.css'
import { Slider, Button } from 'antd'
import { available, using, completed, reserved, edit } from '../laundrypage/status'
import { addMinutes } from 'date-fns'
import styled from 'styled-components'

const Container = styled.div`
  padding: 100px;
`

const Laundry = ({ status, serial }: { status: string; serial: string }) => {
  const [page, setPage] = useState({
    status: reserved,
    caption: '14 minutes left',
    button1: 'Cancel Reservation',
    button2: 'Use Washing Machine',
    showcaption: true,
    showbutton1: true,
    showbutton2: true,
    showTimer: false,
    showSlider: true,
  })

  const [time, setTime] = useState({
    date: new Date(),
    inputValue: 30,
  })

  function onChange(value: number) {
    setTime({
      ...time,
      inputValue: value,
    })
  }

  useEffect(() => {
    setStatus(status)
  }, [status])

  function setStatus(status: string) {
    if (status === reserved) {
      setPage({
        status: reserved,
        caption: '14 minutes left',
        button1: 'Cancel Reservation',
        button2: 'Use Washing Machine',
        showcaption: true,
        showbutton1: true,
        showbutton2: true,
        showTimer: false,
        showSlider: true,
      })
    } else if (status === available) {
      setPage({
        status: available,
        caption: 'Its washy time',
        button1: '',
        button2: 'Use Washing Machine',
        showcaption: true,
        showbutton1: false,
        showbutton2: true,
        showTimer: false,
        showSlider: true,
      })
    } else if (status === completed) {
      setPage({
        status: completed,
        caption: '',
        button1: 'Collected my laundry!',
        button2: '',
        showcaption: false,
        showbutton1: true,
        showbutton2: false,
        showTimer: false,
        showSlider: false,
      })
    } else if (status === using) {
      setPage({
        status: using,
        caption: '',
        button1: '',
        button2: 'Stop washing',
        showcaption: false,
        showbutton1: false,
        showbutton2: true,
        showTimer: true,
        showSlider: false,
      })
    } else if (status === edit) {
      setPage({
        status: edit,
        caption: '',
        button1: '',
        button2: 'Update Duration',
        showcaption: false,
        showbutton1: false,
        showbutton2: true,
        showTimer: false,
        showSlider: true,
      })
    } else {
    }
  }

  function button1Press(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    //button 1
    //e.preventDefault()
    if (page.status === reserved) {
      setStatus(available)
    } else if (page.status === completed) {
      setStatus(available)
    }
  }

  function button2Press(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    //button2
    //e.preventDefault()
    if (page.status === reserved) {
      setStatus(using)
      setTime({
        ...time,
        date: addMinutes(new Date(), time.inputValue),
      })
    } else if (page.status === available) {
      setStatus(using)
      setTime({
        ...time,
        date: addMinutes(new Date(), time.inputValue),
      })
    } else if (page.status === using) {
      setStatus(available)
    } else if (page.status === edit) {
      setStatus(using)
      setTime({
        ...time,
        date: addMinutes(new Date(), time.inputValue),
      })
    }
  }

  function startEdit() {
    setStatus(edit)
  }

  function trial() {
    console.log('hello')
  }

  return (
    <Container>
      <div>
        <img src={laundry} />
        <p>{serial}</p>
        <div>
          {page.showcaption && <p>{page.caption}</p>}
          {page.showbutton1 && (
            <Button type="primary" onClick={(e) => button1Press(e)}>
              {page.button1}
            </Button>
          )}
          {page.showTimer && (
            <div>
              <Timer destination={time.date} activate={() => setStatus(available)} />
              <u onClick={() => startEdit()}>Edit</u>
            </div>
          )}
        </div>
      </div>
      <div>
        {page.showSlider && (
          <>
            <p>{time.inputValue}</p>
            <Slider
              min={0}
              max={50}
              onChange={onChange}
              value={typeof time.inputValue === 'number' ? time.inputValue : 0}
              defaultValue={30}
            />
          </>
        )}
        {page.showbutton2 && (
          <Button type="primary" onClick={(e) => button2Press(e)} block>
            {page.button2}
          </Button>
        )}
      </div>
    </Container>
  )
}
export { Laundry }
