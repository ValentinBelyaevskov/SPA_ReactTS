import React, { useEffect } from "react"
import styles from "./InnerHTML.module.scss"
import { useRef } from 'react';



type Props = {
    innerHTML: string
    setInnerHTMLHaveBeenLoaded: React.Dispatch<React.SetStateAction<boolean>> | undefined
}



export const InnerHTML = (props: Props) => {
    const textRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        if (props.setInnerHTMLHaveBeenLoaded) {
            props.setInnerHTMLHaveBeenLoaded(true);
        }
    }, [])

    useEffect(() => {
        if (textRef.current) {
            textRef.current.innerHTML = props.innerHTML
        }
    }, [textRef.current, props.innerHTML])



    return (
        <div ref={textRef} className={styles.text}>
            {/* {props.innerHTML} */}
        </div >
    )
} 