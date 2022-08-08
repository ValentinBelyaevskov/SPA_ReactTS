import React, { useEffect } from "react"
import styles from "./InnerHTML.module.scss"



type Props = {
    innerHTML: string
    setInnerHTMLHaveBeenLoaded: React.Dispatch<React.SetStateAction<boolean>> | undefined
}



export const InnerHTML = (props: Props) => {
    useEffect(() => {
        if (props.setInnerHTMLHaveBeenLoaded) {
            props.setInnerHTMLHaveBeenLoaded(true);
        } 
    }, [])



    return (
        <div className={styles.text}>
            {props.innerHTML}
        </div >
    )
} 