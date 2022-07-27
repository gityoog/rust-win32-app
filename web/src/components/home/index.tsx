import Layout from 'components/layout'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

export interface iHomeComponent {

}

@Component
export default class HomeComponent extends Vue {
  // service: iLayoutEditor = new ILayoutEditor
  render() {
    return <Layout>
      444
    </Layout>
  }
}