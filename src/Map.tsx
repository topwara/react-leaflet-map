// Lib
import React from 'react'
import { MapContainer } from 'react-leaflet'

// Lib Styles
import 'leaflet/dist/leaflet.css'

// Include
import './Map.scss'
import { MyLayersControl, MyLocation, MyPinList, MyGeoJsonProvinces } from './MapTools'

const Map: React.FC = () => {
  return (
    <div className="box">
      <section className="box-left">
        <img src="https://react-leaflet.js.org/img/logo-title.svg" alt="" />
      </section>
      <section className="box-right">
        <MapContainer center={[13.9812483, 100.6848356]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <MyLayersControl />
          <MyLocation />
          <MyPinList />
          <MyGeoJsonProvinces />
        </MapContainer>
      </section>
    </div>
  )
}

export default Map
