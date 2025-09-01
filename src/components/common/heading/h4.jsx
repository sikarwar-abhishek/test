import React from 'react'

function HeadingFour({text,textAlign='left',className}) {
    return (
        <h4 className={`text-[20px] text-${textAlign} ${className} sm:text-[24px] lg:text-[26px] font-[500] leading-[28.8px]  text-[#EEEEF0] underline-offset-auto decoration-skip-ink h4-new`} dangerouslySetInnerHTML={{ __html: text}}/>
    )
}

export default HeadingFour
