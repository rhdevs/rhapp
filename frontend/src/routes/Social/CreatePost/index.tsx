import React from 'react'
import styled from 'styled-components'
import { CreatePost } from '../../../components/createpost/createpost'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4; !important
`

export default function CreateEditPost() {
  return (
    <>
      <MainContainer>
        <CreatePost status="create" />
      </MainContainer>
    </>
  )
}
