import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { RootState } from '../../../store/types'
import { CreateOrderPageOne } from './Pages/page1'
import { CreateOrderPageTwo } from './Pages/page2'
import { CreateOrderPageThree } from './Pages/page3'

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: #fafaf4;
  position: relative;
`

export default function CreateSupperGroup(props: Props) {
  const { createOrderPage } = useSelector((state: RootState) => state.supper)

  const formPage = (page: number) => {
    if (page === 1) {
      return <CreateOrderPageOne />
    } else if (page === 2) {
      return <CreateOrderPageTwo />
    } else if (page === 3) {
      return <CreateOrderPageThree />
    }
  }

  return <Background>{formPage(createOrderPage)}</Background>
}
