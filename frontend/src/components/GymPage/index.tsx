import React, { useState } from "react";
import GymNavBar from "../GymNavBar";
import GymStatus from "../GymStatus";
import GymKeyWith from "../GymKeyWith";

export default function GymPage() {
  return (
    <>
      <GymNavBar />
      <div style={{ verticalAlign: 'middle', justifyContent: 'center' }}>
      <GymStatus isOpen />
      <GymKeyWith />
      </div>
    </>
  )
}
