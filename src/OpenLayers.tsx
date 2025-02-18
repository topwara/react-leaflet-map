// Lib
import { useEffect } from 'react'

// ol -> root
import { Map, View } from 'ol'
// ol -> layer
import { Tile as TileLayer, Group as LayerGroup } from 'ol/layer'
// ol -> proj
import { fromLonLat } from 'ol/proj'
// ol -> source
import { OSM, TileWMS } from 'ol/source'
// ol -> control
import { OverviewMap, defaults as defaultControls } from 'ol/control'
// ol -> Lib
import LayerSwitcher from 'ol-layerswitcher'
import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher'

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
    title: 'Overlay ThaiAllProvince',
    source: new TileWMS({
      url: 'https://data.opendevelopmentmekong.net/geoserver/ODMekong/tha_admbnda_adm1_rtsd_20190221/wms?service=WMS&request=GetCapabilities&layers=ODMekong%3Atha_admbnda_adm1_rtsd_20190221',
      params: {},
    }),
    opacity: 0.4,
  } as BaseLayerOptions)

  const overlayLayerThaiEEC = new TileLayer({
    title: 'Overlay ThaiEEC',
    source: new TileWMS({
      url: 'https://data.opendevelopmentmekong.net/geoserver/ODMekong/db8856bc-2f79-488e-b2a7-8520de5e950b/wms?service=WMS&request=GetCapabilities&layers=ODMekong%3Adb8856bc-2f79-488e-b2a7-8520de5e950b',
      params: {},
    }),
    opacity: 1,
  } as BaseLayerOptions)

  return [overlayLayerThaiAllProvince, overlayLayerThaiEEC]
}

export const OpenLayersMap = () => {
  const baseMaps = new LayerGroup({ title: 'BaseMaps', layers: baseMapLayer() } as GroupLayerOptions)

  const overlayMaps = new LayerGroup({ title: 'Overlays', layers: overlayMapLayer() } as GroupLayerOptions)

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
      layers: [baseMaps, overlayMaps],
      view: new View({ center: fromLonLat([100.5111439, 13.8156214]), zoom: 8 }),
      controls: defaultControls().extend([overviewMapControl, layerSwitcher]),
    })

    return () => map.setTarget()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div id="map" style={{ height: '100%', width: '100%' }}></div>
}
