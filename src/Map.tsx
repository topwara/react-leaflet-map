// Lib
import React, { useState } from 'react'
import { MapContainer } from 'react-leaflet'

// Lib Styles
import 'leaflet/dist/leaflet.css'

// Include
import './Map.scss'
import {
  MyLayersControl,
  MyLocation,
  MyPinList,
  MyGeoJsonProvinces,
  MyArea,
  MyGeoJsonNationalProvinces,
  MyTimeDimension,
  DesignRegion,
} from './MapTools'
import { OpenLayersMap } from './OpenLayers'

const Map: React.FC = () => {
  type MapType = 'Leaflet' | 'Design' | 'OpenLayer'
  const mapChoose: MapType[] = ['Leaflet', 'Design', 'OpenLayer']
  const [clickMap, setClickMap] = useState<MapType>(mapChoose[0])

  const renderMap = (mapType: MapType) => {
    if (mapType === 'Leaflet') {
      return (
        <MapContainer center={[13.9812483, 100.6848356]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <MyLayersControl />
          <MyLocation />
          <MyPinList />
          <MyArea />
          <MyGeoJsonProvinces />
          <MyGeoJsonNationalProvinces />
          <MyTimeDimension />
        </MapContainer>
      )
    }

    if (mapType === 'Design') {
      return (
        <MapContainer
          center={[13.9812483, 100.6848356]}
          zoom={5.5}
          style={{ backgroundColor: '#d5d5d5', height: '100%', width: '100%' }}
        >
          <DesignRegion />
        </MapContainer>
      )
    }

    if (mapType === 'OpenLayer') {
      return <OpenLayersMap />
    }
  }

  return (
    <div className="box">
      {/*  */}
      <section className="box-left">
        <img src="https://react-leaflet.js.org/img/logo-title.svg" alt="" />
        <section className="box-left-button">
          {mapChoose.map((e) => (
            <button
              onClick={() => setClickMap(e)}
              style={{ backgroundColor: clickMap === e ? 'limegreen' : 'gainsboro' }}
            >
              {e}
            </button>
          ))}
        </section>
      </section>

      {/*  */}
      <section className="box-right" key={clickMap}>
        {renderMap(clickMap)}
      </section>
    </div>
  )
}

export default Map
