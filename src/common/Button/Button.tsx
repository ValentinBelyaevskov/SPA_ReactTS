import styles from './Button.module.scss'

type Params = {
   type?: "button" | "submit" | "reset" | undefined,
   text: string | undefined,
   clickHandler: ((arg: React.MouseEvent) => void) | (() => void),
   containerStyle?: Style,
   buttonStyle?: Style,
   containerClassName?: string,
   buttonClassName?: string,
   color?: "blue" | "red"
   disabled?: boolean
}

interface Props {
   params: Params,
}

type Style = {
   [prop: string]: string
}


const Button = (props: Props) => {
   return (
      <div
         className={`unselectable ${styles.buttonContainer} ${props.params.containerClassName ? props.params.containerClassName : undefined}`}
         style={props.params.containerStyle}
      >
         <button
            className={`${styles.button} ${props.params.buttonClassName} ${props.params.color === "red" ? styles.redButton : styles.blueButton}`}
            style={props.params.buttonStyle}
            onClick={props.params.clickHandler}
            type={props.params.type ? props.params.type : undefined}
            disabled={props.params.disabled ? true: false}
         >
            {props.params.text}
         </button>
      </div>
   )
}

export default Button