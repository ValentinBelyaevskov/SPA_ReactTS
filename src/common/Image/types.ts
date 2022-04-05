export type ImageProps = {
   src?: string
   wrapperStyle?: object
   imgStyle?: object
   additionalClass?: string
   width?: string
   height?: string
   onClick?: (() => void) | ((e: React.MouseEvent<HTMLDivElement>) => void)
}