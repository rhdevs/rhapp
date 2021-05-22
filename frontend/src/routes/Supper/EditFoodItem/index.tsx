import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { AddUpdateCartButton } from '../../../components/Supper/AddUpdateCartButton'
import { MainCard } from '../../../components/Supper/MainCard'
import { QuantityTracker } from '../../../components/Supper/QuantityTracker'
import { getEditFoodItem, updateEditFoodItem } from '../../../store/supper/action'
import { CancelAction, Food } from '../../../store/supper/types'
import { RootState } from '../../../store/types'

const MainContainer = styled.div`
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  background-color: #fafaf4;
  display: flex;
  flex-direction: column;
`
const FoodItemHeader = styled.p`
  font-weight: bold;
  font-size: 24px;
  line-height: 14px;
`

const SectionHeader = styled.p`
  font-weight: 500;
  font-size: 18px;
  line-height: 14px;
`

const Spacer = styled.div`
  height: 24px;
`

// const OptionText = styled.p`
//   font-style: normal;
//   font-weight: 200;
//   font-size: 14px;
//   line-height: 14px;
// `

type FormValues = {
  Sides: string
  Drinks: string
  others: string
  comments: string
  quantity: number
  cancelAction: string
}

const EditFoodItem = () => {
  const dispatch = useDispatch()
  const { isLoading, editFoodItem } = useSelector((state: RootState) => state.supper)
  const params = useParams<{ supperGroupId: string; itemId: string }>()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()
  const onSubmit = (data) => console.log(data)
  // const onSubmit = (data: Food) => {
  //   console.log(data)
  //   dispatch(updateEditFoodItem(data, params.itemId))
  //   console.log(errors)
  // }

  useEffect(() => {
    dispatch(getEditFoodItem(params.supperGroupId, params.itemId))
  }, [dispatch])

  return (
    <MainContainer>
      <TopNavBar title="Edit Item" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <MainCard flexDirection="column" isEditable={false} editIconSize="0rem" padding="25px">
          <FoodItemHeader>{editFoodItem?.foodMenu.foodMenuName}</FoodItemHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            {editFoodItem?.foodMenu.custom?.map((section) => {
              return (
                <>
                  <SectionHeader>{section.title}</SectionHeader>
                  {section.options.map((option, key) => {
                    return (
                      <>
                        <input key={key} {...register('Sides', { required: true })} type="radio" value={option.name} />
                        <br />
                      </>
                    )
                  })}
                  <Spacer />
                </>
              )
            })}

            <SectionHeader>If this product is not available</SectionHeader>
            <input {...register('cancelAction', { required: true })} type="radio" value={'contact'} label="Contact" />
            <br />
            <input {...register('cancelAction', { required: true })} type="radio" value="Cancel" label="Cancel" />
            <Spacer />

            <input
              defaultValue={editFoodItem?.comments}
              {...register('comments')}
              placeholder="Additional comments e.g. BBQ Sauce"
            />
            <Spacer />

            <div style={{ textAlignLast: 'center' }}>
              <QuantityTracker default={editFoodItem?.quantity || 0} />
            </div>
            <Spacer />
            <input type="submit" />
            <AddUpdateCartButton update currentTotal={editFoodItem?.foodPrice?.toString() || '0.00'} />
          </form>
        </MainCard>
      )}
    </MainContainer>
  )
}

export default EditFoodItem
