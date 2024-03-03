import React from 'react'
import loading from '../images/loading.gif'

function Loading() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <span>
        <img src={loading} style={{ width: '500px', height: '350px' }} />
      </span>
    </div>
  )
}

export default Loading