'use client';
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { MdArrowRightAlt } from 'react-icons/md';
import { motion, AnimatePresence } from "framer-motion";


// props for button component
/*
label: string,
href: string,
target: string,
type: string,//filled, filled-white, outline, text
icon: {
  position: left//right
}
*/



// below is dummy styling but style according to figma and use the same button all over the project

const Button = ({ props }) => {
    const [isHovered, setIsHovered] = useState(false);

    const buttonStyle = {
        'filled': {
            background: 'radial-gradient(61.18% 100% at 49.64% 0%, #52A0E9 0%, #2F7EC8 100%)',
            borderImageSource: 'linear-gradient(360deg, #2974B8 0%, #9DD0FF 100%)',
            borderImageSlice: 1,
            borderRadius: '8px',
            fontSize: "16px",
            color: "#fff",
            textAlign: "center",
            cursor: "pointer",
            outline: "none",
            position: "relative",
            zIndex: 1,
            fontWeight: 500,
            overflow: "hidden",
            padding: "6px 24px",
            transition: "all 0.3s ease",
        },
        'filled-white': {
            backgroundColor: isHovered ? "transparent" : "white",
            backgroundImage: isHovered
                ? "radial-gradient(51.29% 40% at 50% 100%, rgba(255, 255, 255, 0.4) 20%, rgba(0, 142, 207, 0.6) 100%)"
                : "none",
            borderRadius: '8px',
            fontSize: "16px",
            color: isHovered ? "white" : "black",
            textAlign: "center",
            cursor: "pointer",
            outline: "none",
            position: "relative",
            zIndex: 1,
            fontWeight: 500,
            overflow: "hidden",
            padding: "6px 24px",
            transition: "all 0.3s ease",
            width: "fit-content",
        },
        'text': {
            borderRadius: '8px',
            fontSize: "16px",
            color: "#fff",
            cursor: "pointer",
            outline: "none",
            position: "relative",
            zIndex: 1,
            fontWeight: 500,
            overflow: "hidden",
            transition: "all 0.3s ease",
        },
        'outline': {
            borderRadius: '8px',
            fontSize: "16px",
            color: "#fff",
            textAlign: "center",
            cursor: "pointer",
            outline: "none",
            position: "relative",
            zIndex: 1,
            fontWeight: 500,
            overflow: "hidden",
            padding: "6px 24px",
            transition: "all 0.3s ease",
        }
    };

    const hoverOverlayStyle = {
        'filled': {
            position: "absolute",
            inset: "0",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.8s ease",
            borderRadius: "8px",
            background: 'radial-gradient(51.29% 51.29% at 48.71% 100%, rgba(255, 255, 255, 0.6) 0%, rgba(0, 142, 207, 0.6) 100%)',
            zIndex: 0, // Ensure the overlay stays behind the text and arrow
        },
        'filled-white': {
            position: "absolute",
            inset: "0",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.8s ease",
            borderRadius: "8px",
            background: 'radial-gradient(51.29% 51.29% at 48.71% 100%, rgba(255, 255, 255, 0.6) 0%, rgba(0, 142, 207, 0.6) 100%)',
            zIndex: 0, // Ensure the overlay stays behind the text and arrow
            width: "fit-content",
        },
        'text': {
            // borderBottom: isHovered?'1px solid':'none',
            // transform: isHovered ? 'translateY(-6px)' : 'none',
        },
        'outline': {}
    };

    const wrapperStyle = {
        'filled': {
            borderRadius: '8px',
            padding: '1px',
            background: 'linear-gradient(360deg, #2974B8 0%, #9DD0FF 100%)',
            display: 'inline-block',
        },
        'filled-white': {
            borderRadius: '8px',
            padding: '1px',
            background: 'linear-gradient(360deg, #2974B8 0%, #9DD0FF 100%)',
            display: 'inline-block',
            width: 'fit-content',
        },
        'text': {
            width: 'fit-content',
        },
        'outline': {
            borderRadius: '8px',
            border: '1px solid #2974B8',
        }
    };

    return (
        <Link href={props?.href || ""} target={props?.target || "_self"} style={wrapperStyle[props?.type || "filled"]}>
            <div
                style={buttonStyle[props?.type || "filled"]}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative group font-medium text-white text-lg transition-all duration-300 ease-out"
            >
                <div className="flex gap-[4px] lineheight[16px] relative z-10">
                    {props?.icon?.position === "left" && (
                        <span>
                            <MdArrowRightAlt size={"1.8em"} />
                        </span>
                    )}
                    <span className="flex flex-col">
                        <span className="h-fit">{props?.label}</span>
                        {props?.type === "text" && (
                            // Reserve space for the animated span
                            <span className="relative w-full h-[1px]">
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.span
                                            className="absolute bg-white w-full h-[1px] left-0"
                                            initial={{
                                                opacity: 0,
                                            }}
                                            animate={{
                                                opacity: 1,
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                ease: "easeInOut",
                                            }}
                                            style={{
                                                transformOrigin: "left", // Animation grows from the left
                                            }}
                                            exit={{
                                                opacity: 0,
                                            }}
                                        ></motion.span>
                                    )}
                                </AnimatePresence>
                            </span>
                        )}
                    </span>
                    {props?.icon?.position === "right" && (
                        <span>
                            <MdArrowRightAlt size={"1rem"} />
                        </span>
                    )}
                </div>

                <div style={hoverOverlayStyle[props?.type || "filled"]}></div>
            </div>
        </Link>
    );
};

export default Button;
