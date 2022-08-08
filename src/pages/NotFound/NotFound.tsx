import styles from "./NotFound.module.scss"


type Props = {}


export const NotFound = (props: {}) => {
    return (
        <div className={`${styles.notFound} page`}>
            This page is under development
        </div>
    )
}