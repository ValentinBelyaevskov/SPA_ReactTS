import React from 'react';
export type ImageProps = {
   src?: string
   wrapperStyle?: object
   imgStyle?: object
   additionalClass?: string
   width?: string
   height?: string
   onClick?: (() => void) | ((e: React.MouseEvent<HTMLDivElement>) => void)
   onMouseEnter?: (() => void) | ((e: React.MouseEvent<HTMLDivElement>) => void)
   onMouseLeave?: (() => void) | ((e: React.MouseEvent<HTMLDivElement>) => void)
   onTouchStart?: (() => void) | ((e: React.TouchEvent<HTMLDivElement>) => void)
   onTouchEnd?: (() => void) | ((e: React.TouchEvent<HTMLDivElement>) => void)
   onLoad?: () => void
   jsx?: JSX.Element
}