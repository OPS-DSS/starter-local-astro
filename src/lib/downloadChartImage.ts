/**
 * Finds the first SVG inside `el`, rasterises it to a canvas, and triggers a
 * PNG download.  Works without any extra dependencies — just XMLSerializer and
 * the browser Canvas API.
 *
 * Scale is 2× by default so the exported image looks sharp on retina displays.
 */
export function downloadChartImage(
  el: HTMLElement | null,
  filename = 'grafico',
  scale = 2,
): void {
  if (!el) return

  const svg = el.querySelector('svg')
  if (!svg) return

  const { width, height } = svg.getBoundingClientRect()
  if (!width || !height) return

  // Serialise SVG — ensure the XML namespace is present so the browser can
  // decode it as an image.
  const serializer = new XMLSerializer()
  let svgStr = serializer.serializeToString(svg)
  if (!svgStr.includes('xmlns=')) {
    svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.scale(scale, scale)
  // White background so transparent areas don't become black in PNG.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl = URL.createObjectURL(blob)

  const img = new Image()
  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height)
    URL.revokeObjectURL(svgUrl)

    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = URL.createObjectURL(pngBlob)
      link.click()
      // Give the browser a moment to start the download before revoking.
      setTimeout(() => URL.revokeObjectURL(link.href), 2000)
    }, 'image/png')
  }
  img.onerror = () => URL.revokeObjectURL(svgUrl)
  img.src = svgUrl
}
