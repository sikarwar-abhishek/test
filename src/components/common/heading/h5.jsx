import React from 'react'

function HeadingFive({text,align='left',className}) {
    return (
        <h5 className={`text-[18px] ${className} font-medium leading-[27px] text-${align} underline-offset-auto decoration-skip-ink h5-new`} dangerouslySetInnerHTML={{ __html: text}}></h5>
    )
}

export default HeadingFive
