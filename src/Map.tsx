// Lib
import React, { useState } from 'react'
import { MapContainer } from 'react-leaflet'

// Lib Styles
import 'leaflet/dist/leaflet.css'

// Include
import './Map.scss'
import { MyLayersControl, MyLocation, MyPinList, MyGeoJsonProvinces, MyArea, MyLayersControlGeo } from './MapTools'
import { OpenLayersMap } from './OpenLayers'

const Map: React.FC = () => {
  type MapType = 'Originals' | 'GeoServer' | 'OpenLayer'
  const mapChoose: MapType[] = ['Originals', 'GeoServer', 'OpenLayer']
  const [map, setMap] = useState<MapType>(mapChoose[2])

  const renderMap = (mapType: MapType) => {
    if (mapType === 'Originals' || mapType === 'GeoServer') {
      return (
        <MapContainer center={[13.9812483, 100.6848356]} zoom={7} style={{ height: '100%', width: '100%' }}>
          {mapType === 'Originals' ? (
            <>
              <MyLayersControl />
              <MyLocation />
              <MyPinList />
              <MyGeoJsonProvinces />
              <MyArea />
            </>
          ) : (
            <>
              <MyLayersControlGeo />
            </>
          )}
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
            <button onClick={() => setMap(e)} style={{ backgroundColor: map === e ? 'limegreen' : 'gainsboro' }}>
              {e}
            </button>
          ))}
        </section>
      </section>

      {/*  */}
      <section className="box-right">{renderMap(map)}</section>
    </div>
  )
}

export default Map
