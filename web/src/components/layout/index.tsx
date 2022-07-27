import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import style from './style.module.scss'
import JSBridge from 'common/js-bridge'
import Header from './header'
import Sidebar from './sidebar'

export interface iLayout {

}

@Component
export default class Layout extends Vue {
  // service: iLayoutEditor = new ILayoutEditor
  render() {
    return <div onContextmenu={event => {
      event.preventDefault()
    }} class={style.layout}>
      <div class={style.left}>
        <Sidebar />
      </div>
      <div class={style.right}>
        <Header />
        <div class={style.content}></div>
      </div>
      <div class={style.bg}>
        <div class={style.img}></div>
      </div>
      <div class={style.resize} onMousedown={() => {
        JSBridge.call('resize')
      }} ></div>
    </div >
  }
}