import { DSChoroplethMap } from '@ops-dss/charts/choropleth-map'

const PALETTE = [
  { color: '#FFFFB2', label: 'Clase 1 (menor)' },
  { color: '#FECC5C', label: 'Clase 2' },
  { color: '#FD8D3C', label: 'Clase 3' },
  { color: '#F03B20', label: 'Clase 4' },
  { color: '#BD0026', label: 'Clase 5 (mayor)' },
]

interface HuilaMapPanelProps {
  geojsonUrl: string
  csvUrl?: string
}

export const HuilaMapPanel = ({ geojsonUrl, csvUrl }: HuilaMapPanelProps) => {
  return (
    <div className="flex flex-col gap-4">
      <DSChoroplethMap
        geojsonUrl={geojsonUrl}
        center={[2.3, -75.7]}
        zoom={8}
        height="520px"
      />

      {/* Legend */}
      <div className="flex flex-wrap gap-3 items-center text-sm">
        <span className="font-medium text-gray-700">Leyenda:</span>
        {PALETTE.map(({ color, label }) => (
          <div key={color} className="flex items-center gap-1.5">
            <div
              style={{
                width: 18,
                height: 18,
                background: color,
                border: '1px solid #9ca3af',
                borderRadius: 3,
                flexShrink: 0,
              }}
            />
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 italic">
        Haz clic en un municipio para ver su valor. Usa la rueda del ratón o los
        controles del mapa para hacer zoom.
      </p>

      {csvUrl && (
        <a
          href={csvUrl}
          download
          className="text-blue-600 hover:underline text-sm w-fit"
        >
          Descargar datos (CSV)
        </a>
      )}
    </div>
  )
}
