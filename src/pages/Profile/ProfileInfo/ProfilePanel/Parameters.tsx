import Parameter from './Parameter'
import styles from './Parameters.module.scss'


type Parameters = ([string, (string | undefined | number | null)?])[]

type Props = {
   parameters: Parameters
   title: string
}


const Parameters = (props: Props) => {
   return (
      <div className={styles.parameters}>
         <div className={styles.parametersTitleContainer}>
            <h3 className={styles.parametersTitle}>{props.title}</h3>
            <hr />
         </div>
         <div className={`${styles.parametersList}`}>
            {props.parameters.map((item) => (
               `${item[1]}`.length && (typeof item[1] === "string" || typeof item[1] === "number")
                  ? <Parameter
                     key={item[0]}
                     parameterName={item[0]}
                     parameterValue={item[1]}
                  />
                  : null
            ))}
         </div>
      </div>
   )
}

export default Parameters