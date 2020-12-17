import React from 'react'
import TopNavBar from '../Mobile/TopNavBar'
import styled from 'styled-components'
import 'antd-mobile/dist/antd-mobile.css'
import { Card } from 'antd-mobile'
import { ReactElement } from 'react'

const BookingContainer = styled(Card)`
  width: 324px;
  height: 68px;
  background: red;
  margin-left: 26px;
  margin-top: 92px;
  filter: drop-shadow(0px 2px 1px #484848);
 }
`

function MyBookings({
  icon,
  title,
  purpose,
  date,
  time,
}: {
  icon?: ReactElement
  title: string
  purpose: string
  date: string
  time: string
}) {
  return <BookingContainer title="hello">Bandroom</BookingContainer>
}

export default MyBookings
