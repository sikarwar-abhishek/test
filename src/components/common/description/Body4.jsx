import React from 'react'

function BodyFour({text,className}) {
    return (
        <p className={`text-[14px] ${className} leading-[14px] md:text-[16px] md:leading-[24px] lg:text-[16px] lg:leading-[24px] font-normal tracking-[0.0025em] text-[#B2B3BD] underline-offset-auto decoration-skip-ink body4`} dangerouslySetInnerHTML={{ __html: text}}></p>
    )
}

export default BodyFour