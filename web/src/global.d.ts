import Vue from 'vue'
declare global {
  type SvgIcon = (props: SvgProps) => void
  interface SvgProps {
    fill?: string
    size?: string
  }
  interface Window {
    MAP_TILE_LAYER?: {
      name: string
      tiles: {
        url: string,
        options?: L.TileLayerOptions & { [key: string]: any }
      }[]
    }[]
    webpackHotUpdate: Function
    INDEX_URL: string
    SOCK_URL: string
    BASE_URL: string
    SYS_NAME: string
    LOGIN_TO_URL: string
    CESIUM_BASE_URL: string
    Cesium: any
    UE_CONFIG: {
      serverUrl: string
      UEDITOR_HOME_URL: string
    }
    UEDITOR_HOME_URL: string
    videojs: any
    yoogApp: Vue
    yoogUtil: any
    test: any
    test2: any
  }
  namespace JSX {
    type Element = any
    // interface ElementClass { render: any }
    // interface ElementChildrenAttribute { children: {} }
    interface ElementAttributesProperty { $props: any }
    interface IntrinsicElements {
      [elem: string]: JSX.Element
    }
    interface IntrinsicAttributes {
      id?: string
      vModel?: any
      vShow?: boolean
      value?: any
      oninput?: Function
      nativeOnKeypress?: (event: KeyboardEvent) => void
      nativeOnClick?: (event: MouseEvent) => void
      onclick_prevent?: (event: MouseEvent) => void
      onDragover?: (event: DragEvent) => void
      ref?: string
      key?: string | number
      class?: string | string[]
      slot?: string
      style?: Partial<CSSStyleDeclaration> | string | object | object[]
    }
    interface IntrinsicClassAttributes<T> extends JSX.IntrinsicAttributes { }
  }
  type PickExclude<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
  /**将指定的属性设置为可选属性 */
  type PartialExtract<T, K extends keyof T> = PickExclude<T, K> & Partial<Pick<T, K>>
  /**树结构 */
  type Tree<T, C extends string = 'children'> = Array<T & { [key in C]: Tree<T, C> }>

  type Merge<T, K> = Pick<T, Exclude<keyof T, keyof K>> & K

  type VueComponent<Props> = new () => { $props: Props | { props: Props } }

  const OPTIONS: {
    mode: 'prod' | 'dev'
    proxyList?: string[]
    socketList?: string[]
    admin: string
  }

  type OnInputValue = InputEvent & { target: { value: string } }


  const isBeta: boolean



  namespace Tsx {
    export type ClassComponent<Props> = new () => { $props: Props | { props: Props } }
    export type FunctionalComponent<Props> = (props: Props | { props: Props }) => JSX.Element
    export type Component<Props = {}> = ClassComponent<Props> | FunctionalComponent<Props>
  }
}
