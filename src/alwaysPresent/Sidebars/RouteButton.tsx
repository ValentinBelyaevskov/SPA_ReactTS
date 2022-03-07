import { NavLink } from "react-router-dom"
import styles from "./RouteButton.module.scss"

interface Props {
   name: string
}

const RouteButton = (props: Props) => {
   return (
      <NavLink to={`/${props.name}`}>
         {
            ({ isActive }) => (
               <span className={`${styles.routeButton} ${isActive ? styles.active: undefined}`}>
                  {props.name}
               </span>
            )
         }
      </NavLink>
   )
}

export default RouteButton