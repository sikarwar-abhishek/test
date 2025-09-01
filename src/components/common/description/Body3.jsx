import React from 'react'

function BodyThree({text,align='left',colour='textGray1',className}) {
    return (
        <p className={`text-[16px] ${className} leading-[24px] md:text-[16px] md:leading-[24px] lg:text-[16px] lg:leading-[24px] font-normal tracking-[0.0025em] text-${colour} underline-offset-auto decoration-skip-ink body3 text-${align}`} dangerouslySetInnerHTML={{ __html: text}}></p>
    )
}

export default BodyThree
