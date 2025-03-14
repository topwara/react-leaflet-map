// Lib
import { useEffect, useState, useCallback } from 'react'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L, { DivIcon, Icon, LatLngExpression, Layer, PathOptions } from 'leaflet'
import { Marker, TileLayer, LayersControl, Tooltip, useMap, Popup, GeoJSON } from 'react-leaflet'

// Lib Styles ***
import './MapTools.scss'
import 'font-awesome/css/font-awesome.min.css'
import 'leaflet-timedimension'
import 'leaflet-easybutton/src/easy-button.js'
import 'leaflet-easybutton/src/easy-button.css'
import 'leaflet-timedimension/dist/leaflet.timedimension.control.css'

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

// ====================== Leaflet ======================

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
    {
      name: 'None',
      url: '',
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
  const map = useMap()
  const [click, setClick] = useState<Boolean>(false)

  useEffect(() => {
    L.easyButton('fa fa-map-marker', () => setClick((current) => !current)).addTo(map)
  }, [map])

  const dataToUse = AirportJson.filter((e) => e.lat && e.lng) as unknown as TLocationPins[]

  return click ? (
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
  ) : null
}

export const MyGeoJsonProvinces = (): JSX.Element | any => {
  const map = useMap()
  const [click, setClick] = useState<Boolean>(true)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)

  useEffect(() => {
    L.easyButton('fa-map', () => setClick((current) => !current)).addTo(map)
  }, [map])

  const geoStyle = (feature: any): PathOptions | any => {
    const region: string = feature.properties.REGION6

    const regionStyle = (color: string): PathOptions => {
      return { weight: 0.3, color: color, fillColor: color, fillOpacity: 0.3, dashArray: '5, 5' }
    }

    // ถ้าเป็นจังหวัดที่ถูกคลิก ให้แสดงสีที่แตกต่าง
    if (selectedProvince && selectedProvince === feature.properties.ADM1_TH) {
      return {
        weight: 3,
        color: '#FF6347', // สีแดงเมื่อเลือก
        fillColor: '#FF6347',
        fillOpacity: 0.7,
        dashArray: '', // เส้นปกติเมื่อคลิก
      }
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

  let currClickProvince: string | null = null
  let prevClickProvince: string | null = null

  const handleEachFeature = (feature: any, layer: Layer) => {
    layer.bindTooltip(feature.properties.ADM1_TH, { direction: 'center' })

    layer.on({
      click: (e: any) => {
        const layer = e.target
        const provinceName = feature.properties.ADM1_TH

        currClickProvince = provinceName

        if (provinceName && prevClickProvince !== currClickProvince) {
          prevClickProvince = currClickProvince

          setSelectedProvince(provinceName)
          map.fitBounds(layer.getBounds(), { maxZoom: 8, animate: true })
        }
        //
        else if (prevClickProvince === currClickProvince) {
          currClickProvince = null
          prevClickProvince = null

          e.target.setStyle(geoStyle(feature))

          setSelectedProvince(null)
          map.fitBounds(layer.getBounds([13.9812483, 100.6848356]), { maxZoom: 6, animate: true })
        }
      },
    })
  }

  return click ? <GeoJSON data={ProvinceJson as any} style={geoStyle} onEachFeature={handleEachFeature} /> : null
}

export const MyGeoJsonNationalProvinces = (): JSX.Element | any => {
  const map = useMap()
  const [click, setClick] = useState<Boolean>(false)

  useEffect(() => {
    L.easyButton('fa-leaf', () => setClick((current) => !current)).addTo(map)
  }, [map])

  // รายชื่อจังหวัดที่มีอุทยานแห่งชาติ
  const nationalParkProvinces = [
    'ตาก',
    'เชียงใหม่',
    'กาญจนบุรี',
    'นครราชสีมา',
    'สุราษฎร์ธานี',
    'ประจวบคีรีขันธ์',
    'เพชรบุรี',
    'ระนอง',
    'ตรัง',
    'พังงา',
    'กระบี่',
    'ภูเก็ต',
    'ชุมพร',
    'นครศรีธรรมราช',
    'สงขลา',
    'สตูล',
    'ยะลา',
    'นราธิวาส',
    'น่าน',
    'แพร่',
    'ลำปาง',
    'ลำพูน',
    'แม่ฮ่องสอน',
    'พะเยา',
    'เชียงราย',
    'อุตรดิตถ์',
    'พิษณุโลก',
    'สุโขทัย',
    'กำแพงเพชร',
    'เพชรบูรณ์',
  ]

  const geoStyle = (feature: any): PathOptions | any => {
    const province: string = feature.properties.ADM1_TH

    if (nationalParkProvinces.includes(province)) {
      return { weight: 1, color: '#FFD700', fillColor: '#FFD700', fillOpacity: 0.5 }
    } else {
      return { weight: 0, fillOpacity: 0 } // ซ่อนจังหวัดที่ไม่มีอุทยานแห่งชาติ
    }
  }

  const handleEachFeature = (feature: any, layer: Layer) => {
    layer.bindTooltip(feature.properties.ADM1_TH, { direction: 'center' })
  }

  return click ? <GeoJSON data={ProvinceJson as any} style={geoStyle} onEachFeature={handleEachFeature} /> : null
}

export const MyArea = (): JSX.Element | null => {
  const regions = [
    {
      name: 'เริ่มต้น',
      lat: 13.9812483,
      lng: 100.6848356,
    },
    {
      name: 'ภาคเหนือ',
      lat: 18.687649,
      lng: 99.64909,
    },
    {
      name: 'ภาคตะวันออกเฉียงเหนือ',
      lat: 16.329128,
      lng: 103.268278,
    },
    {
      name: 'ภาคกลาง',
      lat: 15.704428,
      lng: 100.43386,
    },
    {
      name: 'ภาคตะวันออก',
      lat: 13.49237,
      lng: 101.625931,
    },
    {
      name: 'ภาคตะวันตก',
      lat: 13.968377,
      lng: 99.392089,
    },
    {
      name: 'ภาคใต้',
      lat: 8.416663,
      lng: 99.704774,
    },
  ]

  type TLocate = { lat: number; lng: number; zoom: number; name: string }

  const map = useMap()
  const [position, setPosition] = useState<TLocate>({ ...regions[0], zoom: 7 })

  useEffect(() => {
    map.flyTo({ lat: position['lat'], lng: position.lng }, position.zoom)
  })

  return (
    <div className="button-box">
      {regions.map((e) => (
        <button
          onClick={() => setPosition({ ...e, zoom: 8 })}
          style={{ backgroundColor: e.name === position?.name ? 'orange' : 'grey' }}
        >
          {e.name}
        </button>
      ))}
    </div>
  )
}

export const MyTimeDimension = (): JSX.Element | null => {
  const map = useMap()

  useEffect(() => {
    // เพิ่ม TimeDimension Control (เฉพาะรอบแรกเท่านั้น)
    if (!(map as any).timeDimension) {
      ;(map as any).timeDimension = new L.TimeDimension({
        timeInterval: '2025-03-13T12:00:00Z/2025-03-17T21:00:00Z',
        period: 'PT3H',
      }) as unknown as any

      const timeDimensionControl = new L.Control.TimeDimension({
        position: 'bottomright',
        backwardButton: false,
        forwardButton: false,
        autoPlay: true,
        loopButton: true,
        timeSliderDragUpdate: true,
        minSpeed: 1,
        maxSpeed: 10,
      })

      map.addControl(timeDimensionControl)
    }

    const wmsUrl = 'https://ogcie.iblsoft.com/metocean/wms'

    const wmsLayer = L.tileLayer.wms(wmsUrl, {
      layers: 'gfs-temperature-isbl',
      format: 'image/jpeg', // ใช้ JPEG แทน PNG
      transparent: true,
      opacity: 0.4,
      crs: L.CRS.EPSG4326,
      attribution: 'OGC MetOcean DWG Best Practice Example, IBL Software Engineering',
    } as any)

    const tdLayer = (L as any).timeDimension.layer.wms(wmsLayer, {
      cache: 50,
      cacheBackward: 50,
      cacheForward: 50,
      updateTimeDimension: true,
      requestTimeFromCapabilities: true,
    })

    tdLayer.addTo(map)

    return () => {
      map.removeLayer(tdLayer)
    }
  }, [map])

  return null
}

// ====================== Design  ======================

type TRegionNameTH = 'ภาคเหนือ' | 'ภาคตะวันออกเฉียงเหนือ' | 'ภาคกลาง' | 'ภาคตะวันตก' | 'ภาคตะวันออก' | 'ภาคใต้'
type TRegionLocate = { latlng: number[]; zoom: number; pinList?: TProvincePin[] }
type TProvincePin = { title: string; latlng: LatLngExpression }

export const DesignRegion = (): JSX.Element | any => {
  const map = useMap()
  const [key, setKey] = useState<number>(0)
  const [clickMarker, setClickMarker] = useState<TProvincePin | null>(null)
  const [clickRegion, setClickRegion] = useState<TRegionNameTH | null>(null)
  const [selectedRegionPinList, setSelectedRegionPinList] = useState<any>(null)
  const [selectedMouseOverRegion, setSelectedMouseOverRegion] = useState<string | null>(null)

  map.setMaxZoom(10)

  useEffect(() => {
    if (clickRegion === null) map.flyTo([13.9812483, 100.6848356], 6, { animate: true })
  }, [clickRegion, map, selectedRegionPinList])

  const regionPinList = (pinlist: TProvincePin[]) => {
    const urlImg = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuPzAOB6d0BxKBBN7Kr5fCEwML4vGslJXX2w&s'
    const icon = new DivIcon({ html: `<div class="circle"><img src="${urlImg}" alt="nameThai"></div>` })

    return (
      <MarkerClusterGroup chunkedLoading>
        {pinlist.map((e, index) => {
          return (
            <Marker
              key={index}
              position={e.latlng as LatLngExpression}
              icon={icon}
              eventHandlers={{
                mouseover: (event) => event.target.openPopup(),
                click: () => setClickMarker(e),
              }}
            >
              <Popup>{e.title}</Popup>
            </Marker>
          )
        })}
      </MarkerClusterGroup>
    )
  }

  const style = (weight: number, color: string, opa: number): PathOptions => {
    return { weight: weight, color: color, fillColor: color, fillOpacity: opa, dashArray: '' }
  }

  const geoStyle = (feature: any): PathOptions => {
    const regionName: TRegionNameTH = feature.properties.REGION6

    if (clickRegion === regionName) return style(3, '#229954', 0.7)
    if (!clickRegion && selectedMouseOverRegion === regionName) return style(2, '#ffffff', 1)
    if (clickRegion && clickRegion !== regionName) return style(0, '#ffffff', 0)
    return style(2, '#ffffff', 0)
  }

  const handleEachFeature = useCallback(
    (feature: any, layer: Layer): void => {
      const regionName: TRegionNameTH = feature.properties.REGION6
      const provinceName = feature.properties.ADM1_TH

      const regionLocate: Record<TRegionNameTH, TRegionLocate> = {
        ภาคเหนือ: {
          latlng: [18.745759, 99.495365],
          zoom: 10,
          pinList: [
            { title: 'เชียงใหม่', latlng: [18.838668, 98.979436] },
            { title: 'น่าน', latlng: [18.555097, 100.895489] },
          ],
        },
        ภาคตะวันออกเฉียงเหนือ: {
          latlng: [15.992452, 103.331537],
          zoom: 7,
          pinList: [
            { title: 'อุดรธานี', latlng: [17.455534, 102.983239] },
            { title: 'กาฬสิน', latlng: [16.517006, 103.651221] },
            { title: 'สุริน', latlng: [15.194881, 103.826294] },
          ],
        },
        ภาคกลาง: {
          latlng: [15.364048, 100.493046],
          zoom: 8,
          pinList: [
            { title: 'กรุงเทพ', latlng: [13.762869, 100.504152] },
            { title: 'นครสวรรค์', latlng: [15.6667, 100.412437] },
          ],
        },
        ภาคตะวันออก: {
          latlng: [13.489356, 101.681302],
          zoom: 8.5,
        },
        ภาคตะวันตก: {
          latlng: [14.444092, 99.285204],
          zoom: 8,
        },
        ภาคใต้: {
          latlng: [9.04661, 99.059594],
          zoom: 9,
        },
      }

      const { latlng, pinList } = regionLocate[regionName]

      layer.bindTooltip(clickRegion ? provinceName : regionName, { direction: 'center' })

      layer.on({
        click: () => {
          setClickRegion(regionName)
          setSelectedRegionPinList(pinList)
          setKey((prevKey) => prevKey + 1)
          map.flyTo(latlng as LatLngExpression, 8, { animate: true })
        },
        mouseover: () => {
          setSelectedMouseOverRegion(regionName)
        },
        mouseout: () => {
          setSelectedMouseOverRegion(null)
        },
      })
    },
    [clickRegion, map],
  )

  const handleButtonClick = () => {
    setClickRegion(null)
    setSelectedRegionPinList(null)
    setClickMarker(null)
    setKey((prevKey) => prevKey + 1)
  }

  const res = () => {
    const buttonBack = clickRegion ? (
      <div className="section-button-region">
        <div className="button-region" onClick={handleButtonClick}>
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
        </div>
        <p>{clickRegion}</p>
      </div>
    ) : undefined

    const regionSelectedPinList = selectedRegionPinList ? regionPinList(selectedRegionPinList) : undefined

    const detailSelectedPin = clickMarker ? (
      <div className="section-detail-pin">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuPzAOB6d0BxKBBN7Kr5fCEwML4vGslJXX2w&s"
          alt=""
        />
        <h1>อุทยานแห่งชาติ {clickMarker.title}</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo omnis accusantium alias ea vero quis at
          tenetur doloribus quidem. Natus unde iure ea voluptatem doloremque maiores blanditiis architecto quas.
          Nesciunt?
        </p>
      </div>
    ) : undefined

    return (
      <div>
        {buttonBack}
        {regionSelectedPinList}
        {detailSelectedPin}
        <GeoJSON key={key} data={ProvinceJson as any} style={geoStyle} onEachFeature={handleEachFeature} />
      </div>
    )
  }

  return res()
}

// ====================== GeoServer ======================

// export const MyLayersControlGeo = (): JSX.Element => {
//   const osmKey = '6e5478c8a4f54c779f85573c0e399391'

//   const mapLayers = [
//     {
//       name: 'Google',
//       url: 'https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}',
//     },
//     {
//       name: 'Open Street Map',
//       url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//     },
//     {
//       name: 'CyclOSM',
//       url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
//     },
//     {
//       name: 'CyclMap',
//       url: `https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=${osmKey}`,
//     },
//     {
//       name: 'TransportMap',
//       url: `https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${osmKey}`,
//     },
//     {
//       name: 'Humanitarian',
//       url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
//     },
//     {
//       name: 'None',
//       url: '',
//     },
//   ]

//   return (
//     <LayersControl>
//       {mapLayers.map((ele, idx) => (
//         <LayersControl.BaseLayer key={idx} checked={idx === 0 ? true : false} name={ele.name}>
//           <TileLayer url={ele.url} />
//         </LayersControl.BaseLayer>
//       ))}

//       <LayersControl.Overlay name="Bangkok WMS Layer" checked>
//         <WMSTileLayer
//           url="http://localhost:8080/geoserver/qgis/wms"
//           layers="qgis:tha_admbnda_adm0_rtsd_20220121"
//           format="image/png"
//           version="1.1.0"
//           transparent={true}
//           opacity={0.7}
//           crs={L.CRS.EPSG4326}
//         />
//       </LayersControl.Overlay>
//     </LayersControl>
//   )
// }
