import React from 'react'
import Button from '../common/Button'
import HeadingTwo from '../common/heading/h2'
import BodyOne from '../common/description/Body1'
const HeaderAndButton = ({ props }) => {
    return (
        <div className="container">
            <div className='text-center'>
                {props.heading ? (
                    <HeadingTwo text={props.heading} />
                ) : (
                    ""
                )}
                {props.description && (
                    <div className={`mt-[16px] text-center ${props.descriptionClass ? props.descriptionClass : ""}`}>
                        <BodyOne text={props.description} />
                    </div>
                )}
                {props.button ? (<div className="flex flex-row justify-center mt-[24px] sm:space-y-0 sm:space-x-4 sm:mt-6 px-1 sm:px-0 sm:font-normal"><Button props={props.button} /></div>) : ""}
            </div>
        </div>
    )
}

export default HeaderAndButton