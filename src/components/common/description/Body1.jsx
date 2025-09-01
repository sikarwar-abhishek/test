import React from 'react'

function BodyOne({text}) {
    return (
        <p className={`text-[18px] leading-[27px] md:text-[24px] md:leading-[36px] lg:text-[24px] lg:leading-[36px] font-normal tracking-[0.004em] mb-[8px] text-textGray underline-offset-auto decoration-skip-ink body1`} dangerouslySetInnerHTML={{ __html: text}}></p>        
    )
}

export default BodyOne