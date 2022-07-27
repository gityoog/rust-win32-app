import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import style from './style.module.scss'
import MaxSvg from './最大化.svg'
import MinSvg from './最小化.svg'
import CloseSvg from './关闭.svg'
import SkinSvg from './skin.svg'
import JSBridge from 'common/js-bridge'

@Component
export default class Header extends Vue {
  render() {
    return <div class={style.header} >
      <div class={style.left} onMousedown={() => {
        JSBridge.call("move")
      }}></div>
      <div class={style.right}>
        <div class={style.tool}>
          <div class={style.icon}>
            <SkinSvg fill='#222' />
          </div>
          <div class={style.icon} onClick={() => {
            JSBridge.call("minimize")
          }}>
            <MinSvg />
          </div>
          <div class={style.icon} onClick={() => {
            if (JSBridge.call('isZoomed')) {
              JSBridge.call("restore")
            } else {
              JSBridge.call("maximize")
            }
          }}>
            <MaxSvg />
          </div>
          <div class={style.icon} onClick={() => {
            JSBridge.call("close")
          }}>
            <CloseSvg />
          </div>
        </div>
      </div>
    </div >
  }
}