export default function (source: string) {
  source = source.replace(/export\sdefault\ssymbol/, '')
  source += `export default {
    functional: true,
    render: function (h, context) {
      return h('svg', {
        attrs: {
          fill: context.props.fill || 'currentColor',
        },
        style: [context.data.style, {
          width: context.props.size,
          height: context.props.size 
        }],
        on: context.listeners
      }, [h('use', {
        attrs: {
          'xlink:href': '#' + symbol.id
        }
      })])
    }
  }`
  return source
}