import React, { useState, useEffect } from 'react'
import laundry from '../../assets/laundryicon2.svg'
import { Timer } from '../basiccard/timer'
import 'antd/dist/antd.css'
import { Slider, Button } from 'antd'
import { available, using, completed, reserved, edit } from '../laundrypage/status'
import { addMinutes } from 'date-fns'
import styled from 'styled-components'
import '../../assets/fonts.css'
import TopNavBar from '../Mobile/TopNavBar'
//styling
const Container = styled.div`
  margin: 0 auto;
  margin-top: 40px;
  width: 300px;
`
const Top = styled.div`
  display: flex;
`
const Bottom = styled.div`
  margin-top: 50px;
  text-align: center;
`

const Left = styled.div``

const Right = styled.div`
  margin-left: 15px;
  font-family: Inter;
`

const ButtonContainer1 = styled.div`
  .ant-btn-primary {
    font-family: Inter;
    font-size: 17px;
    font-style: normal;
    font-weight: 200;
    color: FFFFFF;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    width: 210px;
    height: 33px;
    border-radius: 8px;
    background-color: #002642;
    border-color: #002642;
    opacity: 80%;
  }
  .ant-btn-primary:hover,
  .ant-btn-primary:focus {
    font-family: Inter;
    font-size: 17px;
    font-style: normal;
    font-weight: 200;
    color: FFFFFF;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    width: 210px;
    height: 33px;
    border-radius: 8px;
    background-color: #002642;
    border-color: #002642;
    opacity: 80%;
  }
`

const ButtonContainer2 = styled.div`
  .ant-btn-primary {
    background-color: #de5f4c;
    border-color: #de5f4c;
    font-family: Inter;
    font-size: 17px;
    font-style: normal;
    font-weight: 200;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    width: 226px;
    height: 33px;
    border-radius: 8px;
    margin-top: 10px;
  }
  .ant-btn-primary:hover,
  .ant-btn-primary:focus {
    background-color: #de5f4c;
    border-color: #de5f4c;
    font-family: Inter;
    font-size: 17px;
    font-style: normal;
    font-weight: 200;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    width: 226px;
    height: 33px;
    border-radius: 8px;
    margin-top: 10px;
  }
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

  useEffect(() => {
    setStatus(status)
  }, [status])

  //state of component depending on status
  function setStatus(status: string) {
    if (status === reserved) {
      setNavCap('Reserved')
      setPage({
        status: reserved,
        caption: '!',
        button1: 'Cancel Reservation',
        button2: 'Use Washing Machine',
        showcaption: true,
        showbutton1: true,
        showbutton2: true,
        showTimer: false,
        showSlider: true,
      })
    } else if (status === available) {
      setNavCap('Laundry Time')
      setPage({
        status: available,
        caption: 'Its washy time!',
        button1: '',
        button2: 'Use Washing Machine',
        showcaption: true,
        showbutton1: false,
        showbutton2: true,
        showTimer: false,
        showSlider: true,
      })
      setTime({
        ...time,
        inputValue: 30,
      })
    } else if (status === completed) {
      setNavCap('Collect Laundry')

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
      setNavCap('Laundry Time')

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
      setNavCap('Edit duration')

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
      setTime({
        ...time,
        inputValue: 30,
      })
    } else {
    }
  }

  function startEdit() {
    setStatus(edit)
  }

  //Timer settings
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

  function formatter(value: unknown) {
    return `${value} minutes`
  }

  function button1Press(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    //top button
    //button 1
    //e.preventDefault()
    if (page.status === reserved) {
      setStatus(available)
    } else if (page.status === completed) {
      setStatus(available)
    }
  }

  function button2Press(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    //bottom button
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

  const [navCap, setNavCap] = useState('Reservation')

  return (
    <div>
      <TopNavBar title={navCap} />
      <Container>
        <Top>
          <Left>
            <img className="icon" src={laundry} />
          </Left>
          <Right>
            <p className="serial">{serial}</p>
            <div>
              {page.showcaption && (
                <p className="caption">
                  {page.status === reserved && (
                    <Timer
                      destination={new Date('December 17, 2020 17:53:00')}
                      caption={false}
                      onlyMinutes={true}
                      activate={() => {
                        setStatus(available)
                      }}
                      elapsed={false}
                    />
                  )}
                  {page.caption}
                </p>
              )}
              {page.status === edit && (
                <div style={{ marginTop: '25px' }}>
                  {' '}
                  <p className="laundry-timer">
                    {' '}
                    {time.inputValue < 10 && '0'}
                    {`${time.inputValue} : 00`}
                  </p>
                  <p className="timer-caption">
                    {'minutes'} &nbsp; &nbsp;
                    {'seconds'}
                  </p>
                </div>
              )}
              {page.showbutton1 && (
                <ButtonContainer1>
                  <Button type="primary" onClick={(e) => button1Press(e)}>
                    {page.button1}
                  </Button>
                </ButtonContainer1>
              )}
              {page.showTimer && (
                <Top>
                  <Timer
                    destination={time.date}
                    activate={() => setStatus(completed)}
                    caption={true}
                    onlyMinutes={false}
                    elapsed={false}
                  />
                  <u className="edit-button" onClick={() => startEdit()}>
                    Edit
                  </u>
                </Top>
              )}
            </div>
          </Right>
        </Top>
        <Bottom>
          {page.showSlider && (
            <>
              <Slider
                className="slider"
                min={1}
                max={50}
                onChange={onChange}
                value={typeof time.inputValue === 'number' ? time.inputValue : 0}
                defaultValue={30}
                tipFormatter={formatter}
                tooltipPrefixCls="slider-tooltip ant-tooltip"
              />
            </>
          )}
          {page.showbutton2 && (
            <ButtonContainer2>
              <Button type="primary" onClick={(e) => button2Press(e)} block>
                {page.button2}
              </Button>
            </ButtonContainer2>
          )}
        </Bottom>
      </Container>
    </div>
  )
}
export { Laundry }
