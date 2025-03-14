// Lib
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Include
import Map from './Map'
import Rss from './Rss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <Routes>
      <Route path="/" element={<Map />} />,
      <Route path="/rss" element={<Rss />} />,
    </Routes>
  </Router>,
  // <React.StrictMode>
  //   <Map />
  // </React.StrictMode>,
)
