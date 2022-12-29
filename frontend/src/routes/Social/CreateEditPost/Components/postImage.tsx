import React, { useState } from 'react'
import styled from 'styled-components'
import cross from '../../../../assets/CircleCross.svg'
import { ConfirmationModal } from '../../../../components/Mobile/ConfirmationModal'

const MainContainer = styled.div`
  text-align: left;
`

const ImageDiv = styled.div`
  width: 75.49px;
  margin: 6.86px;
  text-align: center;
`
const DeleteImage = styled.div`
  position: relative;
  left: 37.745px;
  top: 10px;
  cursor: pointer;
  border: 0;
  background-color: transparent;
`

export const PostImage = ({ card, deleteFunc }: { card: string; deleteFunc: (string) => void }) => {
  const [modal, setModal] = useState(false)
  return (
    <MainContainer>
      {modal && (
        <ConfirmationModal
          title="Confirm Delete?"
          hasLeftButton
          leftButtonText="Delete"
          onLeftButtonClick={() => deleteFunc(card)} //change paths in future
          rightButtonText="Cancel"
          onRightButtonClick={() => setModal(false)}
        />
      )}
      <ImageDiv>
        <DeleteImage onClick={() => setModal(true)}>
          <img src={cross} />
        </DeleteImage>
        <img width="75.49" height="80.28" src={card} />
      </ImageDiv>
    </MainContainer>
  )
}
