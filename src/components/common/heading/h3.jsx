import React from 'react'

function HeadingThree({text}) {
    return (
        <h3
  className="text-[28px] leading-[34px] md:text-[32px] md:leading-[38.4px] lg:text-[36px] lg:leading-[43.2px] font-medium tracking-[-0.005em] h3-new"
  dangerouslySetInnerHTML={{ __html: text }}/>
    )
}

export default HeadingThree
