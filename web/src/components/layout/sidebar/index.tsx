import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import style from './style.module.scss'
import LogoSvg from './UX.svg'
import SettingSvg from './205设置.svg'
import ASvg from './纸飞机.svg'
import BSvg from './计划中.svg'
import CSvg from './mk.svg'

export interface iSidebar {

}

@Component
export default class Sidebar extends Vue {
  // service: iLayoutEditor = new ILayoutEditor
  render() {
    return <div class={style.sidebar}>
      <div class={style.top}>
        <div class={style.logo}>
          <LogoSvg />
        </div>
      </div>
      <div class={style.center}>
        <div class={style.nav}>
          <div class={[style.icon, style.actived]}>
            <ASvg />
          </div>
          <div class={style.icon}>
            <BSvg />
          </div>
          <div class={style.icon}>
            <CSvg />
          </div>
        </div>
      </div>
      <div class={style.bottom}>
        <div class={style.setting}>
          <SettingSvg />
        </div>
      </div>
    </div >
  }
}