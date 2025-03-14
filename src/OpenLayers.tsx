// Lib
import { useEffect } from 'react'

// ol -> root
import { Map, View } from 'ol'
// ol -> layer
import { Tile as TileLayer, Group as LayerGroup, Vector as VectorLayer } from 'ol/layer'
// ol -> proj
import { fromLonLat, toLonLat } from 'ol/proj'
// ol -> source
import { OSM, TileWMS, Vector as VectorSource } from 'ol/source'
// ol -> control
import { OverviewMap, defaults as defaultControls } from 'ol/control'
// ol -> Lib
import LayerSwitcher from 'ol-layerswitcher'
import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher'
// ol -> Format
import { GeoJSON } from 'ol/format'
// ol -> Style
import { Style, Fill, Stroke } from 'ol/style'
// ol -> loadingstrategy
import { bbox } from 'ol/loadingstrategy'

// Lib Styles
import 'ol/ol.css'
import './OpenLayer.scss'
import 'ol-layerswitcher/dist/ol-layerswitcher.css'

// ===================================================================================

const baseMapLayer = () => {
  const baseLayerOsm = new TileLayer({
    type: 'base',
    title: 'Base OSM',
    source: new OSM(),
  } as BaseLayerOptions)

  const baseLayerTopo = new TileLayer({
    visible: false,
    type: 'base',
    title: 'Topology',
    source: new TileWMS({
      url: 'http://ows.mundialis.de/services/service?',
      params: { layers: 'TOPO-WMS' },
    }),
  } as BaseLayerOptions)

  return [baseLayerOsm, baseLayerTopo]
}

const overlayMapLayer = () => {
  const overlayLayerThaiAllProvince = new TileLayer({
    visible: false,
    title: 'Overlay ThaiAllProvince',
    source: new TileWMS({
      url: 'https://data.opendevelopmentmekong.net/geoserver/ODMekong/wms',
      params: {
        LAYERS: 'ODMekong:tha_admbnda_adm1_rtsd_20190221',
        TILED: true,
        INFO_FORMAT: 'application/json', // ใช้ JSON เพื่อง่ายต่อการแสดงผล
      },
    }),
    opacity: 0.4,
  } as BaseLayerOptions)

  const overlayLayerThaiEEC = new TileLayer({
    visible: false,
    title: 'Overlay ThaiEEC',
    source: new TileWMS({
      url: 'https://data.opendevelopmentmekong.net/geoserver/ODMekong/wms',
      params: {
        LAYERS: 'ODMekong:db8856bc-2f79-488e-b2a7-8520de5e950b',
        TILED: true,
        INFO_FORMAT: 'application/json',
      },
    }),
    opacity: 1,
  } as BaseLayerOptions)

  return [overlayLayerThaiAllProvince, overlayLayerThaiEEC]
}

const vertorMapLayer = () => {
  let debounceTimeout: NodeJS.Timeout | null = null

  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    strategy: bbox, // โหลดเฉพาะพื้นที่ที่มองเห็น
    loader: (extent, resolution, projection) => {
      if (debounceTimeout) clearTimeout(debounceTimeout)

      debounceTimeout = setTimeout(() => {
        // แปลง BBOX จาก EPSG:3857 -> EPSG:4326 (WGS84)
        const extent4326 = [...toLonLat([extent[0], extent[1]]), ...toLonLat([extent[2], extent[3]])]

        const url = `https://data.opendevelopmentmekong.net/geoserver/ODMekong/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ODMekong:tha_admbnda_adm1_rtsd_20190221&bbox=${extent4326.join(',')},EPSG:4326&outputFormat=application/json`

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            const features = new GeoJSON().readFeatures(data, {
              featureProjection: projection, // แปลงให้อยู่ใน EPSG:3857
            })

            vectorSource.clear() // เคลียร์ข้อมูลเก่า
            vectorSource.addFeatures(features) // เพิ่มข้อมูลใหม่
          })
          .catch((error) => console.error('Error loading WFS data:', error))
      }, 300)
    },
  })

  const vectorLayer = new VectorLayer({
    visible: false,
    title: 'Thai Provinces',
    source: vectorSource,
    renderMode: 'image',
    style: new Style({
      fill: new Fill({
        color: 'rgba(165,80,51,0.5)',
      }),
      stroke: new Stroke({
        color: '#A55033',
        width: 0.1,
      }),
    }),
  } as BaseLayerOptions)

  return [vectorLayer]
}

export const OpenLayersMap = () => {
  const baseMaps = new LayerGroup({ title: 'BaseMaps', layers: baseMapLayer() } as GroupLayerOptions)

  const overlayMaps = new LayerGroup({ title: 'Overlays', layers: overlayMapLayer() } as GroupLayerOptions)

  const vertorMaps = new LayerGroup({ title: 'Vectors', layers: vertorMapLayer() } as GroupLayerOptions)

  const layerSwitcher = new LayerSwitcher({
    reverse: false,
    label: 'Layer',
    tipLabel: 'Legend',
    startActive: false,
    activationMode: 'mouseover',
    groupSelectStyle: 'children',
    collapseTipLabel: 'Collapse legend',
  })

  const overviewMapControl = new OverviewMap({ layers: [new TileLayer({ source: new OSM() })] })

  useEffect(() => {
    const map = new Map({
      target: 'map',
      layers: [baseMaps, overlayMaps, vertorMaps],
      view: new View({ center: fromLonLat([100.5018, 13.7563]), zoom: 6 }),
      controls: defaultControls().extend([overviewMapControl, layerSwitcher]),
    })

    return () => map.setTarget()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div id="map" style={{ height: '100%', width: '100%' }}></div>
}
