import React from 'react'

function HeadingOne({text}) {
    {/*<h1 className="sm:text-[72px] text-[36px] sm:leading-[86.4px] leading-[43.2px] text-transparent bg-clip-text bg-gradient-to-r from-[#0094CA] via-[#eaeff5] to-[#0A9ED4] font-[500] h1-new" dangerouslySetInnerHTML={{ __html: text}}></h1>*/}
    return (
        <h1
  className="text-[40px] leading-[48px] md:text-[60px] md:leading-[72px] lg:text-[72px] lg:leading-[86.4px] text-transparent bg-clip-text bg-gradient-to-r from-[#0094CA] via-[#eaeff5] to-[#0A9ED4] font-medium h1-new"
  dangerouslySetInnerHTML={{ __html: text }}/>
    )
}

export default HeadingOne

//text-transparent bg-clip-text bg-gradient-to-r from-[#0094CA] via-[#eaeff5] to-[#0A9ED4] font-[500] text-[36px] sm:text-[53.4px] leading-[43.2px] sm:leading-[64.08px]