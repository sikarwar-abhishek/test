import React from 'react'

function BodyTwo({text}) {
    return (
        <p className={`text-[18px] leading-[27px] md:text-[18px] md:leading-[27px] lg:text-[18px] lg:leading-[27px] font-normal text-left decoration-none text-white body2`} dangerouslySetInnerHTML={{ __html: text}}></p>
    )
}

export default BodyTwo

