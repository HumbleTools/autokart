import React from 'react'

export interface PopinProps {
  displayPopin: boolean
  toggleDisplay: () => void
  children?: React.ReactNode
}

export const Popin = (props: PopinProps) => {
  return <>
        {props.displayPopin && <div className='blurred-overlay' onClick={props.toggleDisplay}>
            <div className="popin" onClick={(e) => e.stopPropagation()}>
                {props.children}
            </div>
        </div>}
    </>
}
