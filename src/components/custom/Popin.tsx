import React from "react";

export interface PopinProps {
    display: boolean;
    toggleDisplay: () => void;
    children: React.ReactNode;
}

export const Popin = (props: PopinProps) => {
    return <>
        {props.display && <div className='blurred-overlay' onClick={props.toggleDisplay}>
            <div className="popin" onClick={(e) => e.stopPropagation()}>
                {props.children}
            </div>
        </div>}
    </>;
}