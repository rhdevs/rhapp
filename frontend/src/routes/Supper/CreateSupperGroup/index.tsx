import React, { useEffect } from 'react'
import { FieldError } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import styled from 'styled-components'
import { V1_BACKGROUND } from '../../../common/colours'
import { setSupperGroup } from '../../../store/supper/action'
import { SupperGroup, SupperGroupStatus } from '../../../store/supper/types'
import { RootState } from '../../../store/types'
import { CreateOrderPageOne } from './Pages/page1'
import { CreateOrderPageTwo } from './Pages/page2'
import { CreateOrderPageThree } from './Pages/page3'

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: ${V1_BACKGROUND};
  position: relative;
`

export const ErrorText = styled.p`
  margin: 5px 0 0 0;
  color: #ff837a;
  width: 100%;
  text-align: center;
  font-family: 'Inter';
`

export const InputText = styled.input<{ flex?: boolean; error?: FieldError | undefined }>`
  width: 80%;
  border-radius: 30px;
  border: 1px solid #d9d9d9;
  padding: 5px 10px;
  margin: 5px auto 0 auto;
  height: 35px;
  ${(props) => props.flex && 'display: flex;'}
  ${(props) => props.error && 'borderColor: red; background:#ffd1d1;'}
`

export const initSupperGroup: SupperGroup = {
  costLimit: undefined,
  createdAt: undefined,
  currentFoodCost: 0,
  location: '',
  numOrders: 0,
  ownerId: localStorage.userID,
  ownerName: '',
  ownerTele: '',
  paymentInfo: [],
  restaurantName: '',
  splitAdditionalCost: undefined,
  status: SupperGroupStatus.OPEN,
  supperGroupId: undefined,
  supperGroupName: '',
  totalPrice: 0,
  closingTime: undefined,
}

export default function CreateSupperGroup() {
  const params = useParams<{ page: string }>()
  const { supperGroup } = useSelector((state: RootState) => state.supper)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!supperGroup) dispatch(setSupperGroup(initSupperGroup))
  }, [])

  console.log(params.page)
  const formPage = (page: number) => {
    if (page === 1) {
      return <CreateOrderPageOne />
    } else if (page === 2) {
      return <CreateOrderPageTwo />
    } else if (page === 3) {
      return <CreateOrderPageThree />
    }
  }

  return <Background>{formPage(Number(params.page))}</Background>
}
