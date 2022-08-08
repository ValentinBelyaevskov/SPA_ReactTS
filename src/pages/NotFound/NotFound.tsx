import styles from "./NotFound.module.scss"


type Props = {}



export const NotFound = (props: {}) => {
    return (
        <div className={`${styles.notFound} page`}>
            <div className={`${styles.title} pagePart`}>
                This page is under development
            </div>
        </div>
    )
}