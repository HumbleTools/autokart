import { useState } from 'react'
import { PopinProps } from '../components/custom/Popin'

export const usePopin: () => PopinProps = () => {
  const [displayPopin, setDisplayPopin] = useState(false)
  const toggleDisplay = () => setDisplayPopin(!displayPopin)

  return {
    displayPopin,
    toggleDisplay
  }
}
