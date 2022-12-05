import React, { useEffect } from 'react'
import { FieldError } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import styled from 'styled-components'
import { V1_BACKGROUND } from '../../../common/colours'
import PullToRefreshRH from '../../../components/PullToRefreshRH'
import { initSupperGroup } from '../../../store/stubs'
import { setSupperGroup } from '../../../store/supper/action/setter'
import { PATHS } from '../../Routes'
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

export default function CreateSupperGroup() {
  const params = useParams<{ page: string }>()
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(setSupperGroup(initSupperGroup))
  }, [])

  if (!(params.page === '1' || params.page === '2' || params.page === '3')) {
    history.replace(`${PATHS.CREATE_SUPPER_GROUP}/1`)
  }

  const formPage = (page: number) => {
    if (page === 1) {
      return <CreateOrderPageOne />
    } else if (page === 2) {
      return <CreateOrderPageTwo />
    } else if (page === 3) {
      return <CreateOrderPageThree />
    }
  }

  return (
    <PullToRefreshRH>
      <Background>{formPage(Number(params.page))}</Background>
    </PullToRefreshRH>
  )
}
