"use client"

import { useState } from "react"
import { useDrawingContext } from "../context/drawing-context"

export const ColorPicker = () => {
    const {color, setColor} = useDrawingContext()

    return(
        <div className='flex justify-center items-center m-2 w-8'>
        <input type='color' value={color} onChange={(e) => {setColor(e.target.value)}}></input>
      </div>
    )

}