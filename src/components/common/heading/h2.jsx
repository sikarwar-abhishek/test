import React from 'react'

function HeadingTwo({text,className}) {
    return (
        <h2
  className={`text-[32px] ${className} leading-[38.4px] md:text-[40px] md:leading-[48px] lg:text-[40px] lg:leading-[48px] font-medium color-white tracking-[-0.005em] decoration-skip-ink h2-new`}
  dangerouslySetInnerHTML={{ __html: text }}/>
    )
}

export default HeadingTwo
