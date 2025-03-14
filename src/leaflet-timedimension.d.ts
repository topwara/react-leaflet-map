import * as L from 'leaflet'

declare module 'leaflet' {
  class TimeDimension extends L.Class {
    constructor(options?: any)
  }

  namespace Control {
    class TimeDimension extends L.Control {
      constructor(options?: any)
    }
  }

  namespace timeDimension {
    function layer(): {
      wms(baseLayer: L.Layer, options?: any): L.Layer
    }
  }
}
