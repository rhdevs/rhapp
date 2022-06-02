import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import DailyViewDatesRow from './DailyViewDatesRow'
import { render, cleanup, screen } from '../../test-utils'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  cleanup()
  unmountComponentAtNode(container)
  container.remove()
  container = null
})

it('renders without crashing the app', () => {
  render(<DailyViewDatesRow selectedDate={new Date()} selectedFacilityId={1} />, container)
})

it('changes dates when I click on a different date', () => {
  const { getByText } = render(<DailyViewDatesRow selectedDate={new Date()} selectedFacilityId={1} />)

  // console.log(test)
  const number = new Date().getDate().toString()
  userEvent.click(screen.getByText(number + 1))
  expect(getByText(number + 1)).toHaveStyle('background-color: #468751;')
})
