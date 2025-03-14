// Lib
import React, { useEffect, useState } from 'react'

const Rss: React.FC = () => {
  const [rssData, setRssData] = useState<string>('')

  useEffect(() => {
    fetch('http://localhost:3001/rss')
      .then((response) => response.text())
      .then((data) => setRssData(data))
      .catch((error) => console.error('Error fetching RSS:', error))
  }, [])

  const handleRedirect = () => {
    window.location.href = 'http://localhost:3001/rss' // Redirect ไปยัง RSS
  }

  return (
    <div>
      <h2>RSS Feed</h2>
      <pre>{rssData || 'Loading...'}</pre>
      <button onClick={handleRedirect} style={{ marginTop: '10px', padding: '10px', cursor: 'pointer' }}>
        เปิด RSS ในเบราว์เซอร์
      </button>
    </div>
  )
}

export default Rss
