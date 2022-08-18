import { useHoverAndTouchClassNames } from 'hooks/useHoverAndTouchClassNames';
import styles from './Button.module.scss';
import { useEffect, useState } from 'react';



type Params = {
   type?: "button" | "submit" | "reset" | undefined,
   text?: string,
   clickListener: ((arg: React.MouseEvent) => void) | (() => void),
   mouseDownHandler?: ((arg: React.MouseEvent) => void) | (() => void),
   mouseUpHandler?: ((arg: React.MouseEvent) => void) | (() => void),
   mouseEnterHandler?: ((arg: React.MouseEvent) => void) | (() => void),
   mouseLeaveHandler?: ((arg: React.MouseEvent) => void) | (() => void),
   touchStartHandler?: ((arg: React.TouchEvent) => void) | (() => void),
   touchEndHandler?: ((arg: React.TouchEvent) => void) | (() => void),
   containerStyle?: Style,
   buttonStyle?: Style,
   changeStyleOnHover?: boolean
   containerClassName?: string,
   buttonClassName?: string,
   color?: "blue" | "red"
   disabled?: boolean
   buttonRef?: React.RefObject<HTMLButtonElement>
   jsx?: JSX.Element
}

interface Props {
   params: Params,
}

type Style = {
   [prop: string]: string
}



const Button = (props: Props) => {
   const buttonHoverAndTouchClassNames = useHoverAndTouchClassNames(styles.hover, styles.touch);
   const [makeTimeout, setMakeTimeout] = useState<boolean>(true)


   const onMouseEnter = (e: React.MouseEvent) => {
      buttonHoverAndTouchClassNames.mouseEnterListener();

      props.params.mouseEnterHandler ?
         props.params.mouseEnterHandler(e)
         : (() => { })()
   }

   const onMouseLeave = (e: React.MouseEvent) => {
      props.params.mouseLeaveHandler ?
         props.params.mouseLeaveHandler(e)
         : (() => { })()
   }

   const onTouchStart = (e: React.TouchEvent) => {
      buttonHoverAndTouchClassNames.touchStartListener();

      props.params.touchStartHandler ?
         props.params.touchStartHandler(e)
         : (() => { })()
   }

   const onTouchEnd = (e: React.TouchEvent) => {
      buttonHoverAndTouchClassNames.touchEndListener();

      props.params.touchEndHandler ?
         props.params.touchEndHandler(e)
         : (() => { })()
   }

   const onClick = (e: React.MouseEvent) => {
      props.params.clickListener(e);
      buttonHoverAndTouchClassNames.clickListener();
   }




   useEffect(() => {
      return () => setMakeTimeout(false)
   }, [])




   return (
      <div
         className={`unselectable ${styles.buttonContainer} ${props.params.containerClassName ? props.params.containerClassName : undefined}`}
         style={props.params.containerStyle}
      >
         <button
            className={`${styles.button} ${props.params.changeStyleOnHover ? buttonHoverAndTouchClassNames.className : null} ${props.params.buttonClassName} ${props.params.color === "red" ? styles.redButton : styles.blueButton}`}
            style={props.params.buttonStyle}
            onClick={onClick}
            onMouseDown={props.params.mouseDownHandler}
            onMouseUp={props.params.mouseUpHandler}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            type={props.params.type ? props.params.type : undefined}
            disabled={props.params.disabled ? true : false}
            ref={props.params.buttonRef ? props.params.buttonRef : undefined}
         >
            {
               props.params.jsx ?
                  props.params.jsx
                  : null
            }
            {props.params.text}
         </button>
      </div>
   )
}

export default Button