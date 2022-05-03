import { Button } from '../../../../common'
import styles from './SignInButton.module.scss'


// types
type Props = {
   type: "submit" | "button",
   name: "login" | "loginAsGuestMode" | "createAccountBtn" | "register" | "resetPassword",
   clickHandler: () => void
   isValid?: boolean
}

type SignInButton = {
   clickHandler: () => void,
   text: "Create account" | "Login" | "Login as guest" | "Register" | "Reset Password" | undefined,
   type: "button" | "submit",
   containerClassName: string,
   buttonStyle: { padding: string },
   isValid?: boolean
   changeStyleOnHover: boolean
}


const SignInButton = (props: Props) => {
   const buttonParams: SignInButton = {
      buttonStyle: { padding: "4px 15px" },

      clickHandler: props.clickHandler,

      containerClassName: `${styles[props.name]} ${styles.buttonContainer}`,

      text: props.name === "login"
         ? "Login"
         : props.name === "createAccountBtn"
            ? "Create account"
            : props.name === "register"
               ? "Register"
               : props.name === "loginAsGuestMode"
                  ? "Login as guest"
                  : props.name === "resetPassword"
                     ? "Reset Password"
                     : undefined,

      type: props.type,
      isValid: !props.isValid,
      changeStyleOnHover: true
   }


   return <Button params={buttonParams} />
}

export default SignInButton