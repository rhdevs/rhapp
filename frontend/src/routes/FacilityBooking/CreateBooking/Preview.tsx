import React, { useState } from 'react'

import BookingSection from '../../../components/FacilityBooking/BookingSection'
import ViewSection from '../../../components/FacilityBooking/ViewSection'

const Preview = () => {
  const [isViewSection, setIsViewSection] = useState<boolean>(true)
  const Text = () => {
    return <>This is the {isViewSection ? 'view' : 'booking'} section</>
  }

  return (
    <>
      <div style={{ margin: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
        <Text />
        <button onClick={() => setIsViewSection(!isViewSection)}>
          {`see ${!isViewSection ? 'view' : 'booking'} section`}
        </button>
      </div>
      <hr />
      {isViewSection ? <ViewSection /> : <BookingSection />}
    </>
  )
}

export default Preview
