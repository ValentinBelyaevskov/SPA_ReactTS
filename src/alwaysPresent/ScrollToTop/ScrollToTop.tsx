import styles from './ScrollToTop.module.scss'
import { Button } from 'common';




type Props = {
}




const ScrollToTop = (props: Props) => {
   const buttonClickListener = (): void => {

   }



   return (
      <Button
         params={
            {
               type: "button",
               clickListener: buttonClickListener,
               containerClassName: styles.scrollToTopButtonContainer,
               buttonClassName: styles.scrollToTopButton,
               changeStyleOnHover: true,
               jsx: <img className={styles.scrollToTopButtonArrow} src="./icons/arrowUpWhite.svg" alt="Scroll to top button" />
            }
         }
      />
   )
}




export default ScrollToTop