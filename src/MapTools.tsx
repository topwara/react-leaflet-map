// Lib
import { useEffect, useState } from 'react'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L, { DivIcon, Icon, LatLngExpression, PathOptions } from 'leaflet'
import { Marker, TileLayer, LayersControl, Tooltip, useMap, Popup, GeoJSON } from 'react-leaflet'

// Lib Styles *
import 'leaflet-easybutton/src/easy-button.js'
import 'leaflet-easybutton/src/easy-button.css'
import 'font-awesome/css/font-awesome.min.css'

// Include
import AirportJson from './data/Airport.json'
import ProvinceJson from './data/province.json'

type TLocationPins = {
  Y2554: string
  Y2555: string
  code: string
  imageUrl: string
  lat: string
  lng: string
  nameEnglish: string
  nameThai: string
}

export const MyLayersControl = (): JSX.Element => {
  const osmKey = '6e5478c8a4f54c779f85573c0e399391'

  const mapLayers = [
    {
      name: 'Google',
      url: 'https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}',
    },
    {
      name: 'Open Street Map',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
    {
      name: 'CyclOSM',
      url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    },
    {
      name: 'CyclMap',
      url: `https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=${osmKey}`,
    },
    {
      name: 'TransportMap',
      url: `https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${osmKey}`,
    },
    {
      name: 'Humanitarian',
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    },
  ]

  return (
    <LayersControl>
      {mapLayers.map((ele, idx) => (
        <LayersControl.BaseLayer key={idx} checked={idx === 0 ? true : false} name={ele.name}>
          <TileLayer url={ele.url} />
        </LayersControl.BaseLayer>
      ))}
    </LayersControl>
  )
}

export const MyLocation = (): JSX.Element | null => {
  const map = useMap()
  const [position, setPosition] = useState<null | LatLngExpression>(null)

  const housingIcon = new Icon({
    iconUrl: 'https://img.icons8.com/plasticine/100/exterior.png',
    iconSize: [35, 35],
  })

  useEffect(() => {
    if (!map) return

    L.easyButton('fa-male', () => {
      map.locate().on('locationfound', (e) => {
        setPosition(e.latlng)
        map.flyTo(e.latlng, 13)
      })
    }).addTo(map)
  }, [map])

  return position === null ? null : (
    <Marker icon={housingIcon} position={position}>
      <Tooltip>📢 You are here !</Tooltip>
    </Marker>
  )
}

export const MyPinList = (): JSX.Element[] | any => {
  const dataToUse = AirportJson.filter((e) => e.lat && e.lng) as unknown as TLocationPins[]

  return (
    <MarkerClusterGroup chunkedLoading>
      {dataToUse.map((e, idx) => {
        const icon = new DivIcon({
          html: `<div class="circle"><img src="${e.imageUrl}" alt="${e.nameThai}"></div>`,
        })

        const latlng = [parseFloat(e.lat), parseFloat(e.lng)] as LatLngExpression

        return (
          <Marker
            key={idx}
            position={latlng}
            icon={icon}
            eventHandlers={{ mouseover: (event) => event.target.openPopup() }}
          >
            <Popup>
              <div className="hover-detail">
                <img src={e.imageUrl} alt={e.nameThai} />
                <h2>{e.nameThai}</h2>
                <h2>{e.nameEnglish}</h2>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MarkerClusterGroup>
  )
}

export const MyGeoJsonProvinces = (): JSX.Element | any => {
  const map = useMap()
  const [click, setClick] = useState<Boolean>(false)

  useEffect(() => {
    L.easyButton('fa-map', () => setClick((current) => !current)).addTo(map)
  }, [map])

  const geoStyle = (feature: any): PathOptions | any => {
    const region: string = feature.properties.REGION6

    const regionStyle = (color: string): PathOptions => {
      return { weight: 2, color: color, fillColor: color, fillOpacity: 0.5 }
    }

    switch (region) {
      case 'ภาคเหนือ':
        return regionStyle('#FF99FF')
      case 'ภาคตะวันออกเฉียงเหนือ':
        return regionStyle('#E6AF73')
      case 'ภาคกลาง':
        return regionStyle('#EBD63D')
      case 'ภาคตะวันออก':
        return regionStyle('#D0E382')
      case 'ภาคตะวันตก':
        return regionStyle('#8A9FD2')
      case 'ภาคใต้':
        return regionStyle('#69C2C2')
    }
  }

  const handleEachFeature = (feature: any, layer: any) => {
    layer.bindTooltip(feature.properties.ADM1_TH, { direction: 'center' })
  }

  return click ? <GeoJSON data={ProvinceJson as any} style={geoStyle} onEachFeature={handleEachFeature} /> : null
}
