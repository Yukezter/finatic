export default ({ typography, palette }) =>
  function (tooltip, e) {
    let tooltipEl = document.getElementById('stock-price-chart-tooltip')

    if (!tooltipEl) {
      tooltipEl = document.createElement('div')
      tooltipEl.id = 'stock-price-chart-tooltip'

      document.querySelector('#stock-price-chart').parentNode.appendChild(tooltipEl)
    }

    if (tooltip.opacity === 0) {
      tooltipEl.style.display = 'none'
      return
    }

    tooltipEl.classList.remove('above', 'below')

    if (tooltip.yAlign) {
      tooltipEl.classList.remove('no-transform')
      tooltipEl.classList.add(tooltip.yAlign)
    }

    if (tooltip.title) {
      const titleLines = tooltip.title || []
      let innerHtml = ''

      titleLines.forEach(function (title) {
        innerHtml += '<span>' + title + '</span>'
      })

      tooltipEl.innerHTML = innerHtml
    }

    const position = this._chart.canvas.getBoundingClientRect()

    tooltipEl.style.display = 'block'
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.top = 0 + 'px'
    tooltipEl.style.left = tooltip.caretX - tooltipEl.clientWidth / 2 + 'px'
    tooltipEl.style.right = 'initial'
    tooltipEl.style.whiteSpace = 'nowrap'
    tooltipEl.style.fontFamily = typography.fontFamily
    tooltipEl.style.fontSize = typography.subtitle2.fontSize
    tooltipEl.style.fontWeight = typography.fontWeightRegular
    tooltipEl.style.color = palette.text.hint
    tooltipEl.style.pointerEvents = 'none'

    // Lastly, we force the tooltip to always stay inside of the canvas
    if (tooltip.caretX < tooltipEl.clientWidth) {
      tooltipEl.style.left = 0
    } else if (tooltip.caretX + tooltipEl.clientWidth / 2 > position.width) {
      tooltipEl.style.left = 'initial'
      tooltipEl.style.right = 0
    }
  }
