import Vue, { VueConstructor, FunctionalComponentOptions } from "vue"

type componentProps = {
  nativeOnKeypress?(event: KeyboardEvent): void
  nativeOnKeydown?(event: KeyboardEvent): void
  nativeOn?: Record<string, Function | Function[]>
  on?: Record<string, Function | Function[]>
}

type Props<T> = (T & componentProps) | { props: (T & componentProps) }

interface VueClassComponent<T> extends Vue {
  new(option: Props<T>): { $props: Props<T> }
}

export function VueToTsx<T extends {} = {}>(component: VueConstructor) {
  return component as unknown as VueClassComponent<T>
}
export function VueToTsxGeneric<T extends (props: any) => JSX.Element>(component: VueConstructor) {
  return component as unknown as VueClassComponent<Parameters<T>[0]>
}

export function FC<T extends object>(component: FunctionalComponentOptions<T>) {
  return component as unknown as (props: T | { props: T }) => JSX.Element
}
export function FCGeneric<T extends ((props: any) => JSX.Element)>(component: FunctionalComponentOptions<Parameters<T>[0]>) {
  return component as unknown as T
}
export type scopedSlots<T extends Record<string, any>> = { [K in keyof T]?: (props: T[K]) => JSX.Element }

export { Vue }