declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}
declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}
declare module '*.module.sass' {
  const classes: { [key: string]: string }
  export default classes
}
declare module '*.module.less' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.jpg' {
  const image: string
  export default image
}

declare module '*.png' {
  const image: string
  export default image
}

declare module '*.gif' {
  const image: string
  export default image
}

declare module '*.svg' {
  const svg: (props: SvgProps) => any
  export default svg
}

declare module '*?raw' {
  const content: string
  export default content
}