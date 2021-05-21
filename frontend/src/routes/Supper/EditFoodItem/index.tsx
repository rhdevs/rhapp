import { Select } from 'antd'
import { Input } from 'antd'
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
import { Food } from '../../../store/supper/types'
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

// const OptionText = styled.p`
//   font-style: normal;
//   font-weight: 200;
//   font-size: 14px;
//   line-height: 14px;
// `

type FormValues = {
  sides: string
  drinks: string
  others: string
  comments: string
  quantity: number
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

  const onSubmit = (data: Food) => {
    dispatch(updateEditFoodItem(data, params.itemId))
    console.log(errors)
  }

  useEffect(() => {
    dispatch(getEditFoodItem(params.supperGroupId, params.itemId))
  }, [dispatch])

  return (
    <MainContainer>
      <TopNavBar title="Edit Item" />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <MainCard flexDirection="column" isEditable={false} editIconSize="0rem">
          <FoodItemHeader>{editFoodItem?.foodMenu.foodMenuName}</FoodItemHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            {editFoodItem?.foodMenu.custom?.map((section) => {
              return (
                <>
                  <SectionHeader>{section.title}</SectionHeader>
                  {/* <Select value="" onChange={(e) => setValue('muiSelect', e.target.value as number[])}>
                    {section.options.map((option) => {
                      return <MenuItem value={option.name}>{option.name}</MenuItem>
                    })}
                  </Select> */}
                </>
              )
            })}
            <SectionHeader>If this product is not available</SectionHeader>
            <select {...register}>
              <option value="contact">contact</option>
              <option value="cancel">cancel</option>
            </select>

            <Input defaultValue={editFoodItem?.comments} {...register('comments')} />
            <div style={{ textAlignLast: 'center' }}>
              <QuantityTracker default={editFoodItem?.quantity || 0} />
            </div>
            <AddUpdateCartButton update currentTotal={editFoodItem?.foodPrice?.toString() || '0.00'} />
          </form>
        </MainCard>
      )}
    </MainContainer>
  )
}

export default EditFoodItem
