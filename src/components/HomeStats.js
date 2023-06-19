import React from 'react'

const HomeStats = () => {
  return (
    <div>
      <h2>Orders</h2>

      <div className='grid grid-cols-3 gap-4'>
        <div className='tile'>
          <h3 className='tile-header'>Today</h3>
          <div className='tile-number'>2</div>
        </div>

        <div className='tile'>
          <h3 className='tile-header'>This Week</h3>
          <div className='tile-number'>12</div>
        </div>

        <div className='tile'>
          <h3 className='tile-header'>This Month</h3>
          <div className='tile-number'>22</div>
        </div>
      </div>
    {/* ----------------------------- */}
      <h2>Revenu</h2>

      <div className='grid grid-cols-3 gap-4'>
        <div className='tile'>
          <h3 className='tile-header'>Today</h3>
          <div className='tile-number'>223</div>
        </div>

        <div className='tile'>
          <h3 className='tile-header'>This Week</h3>
          <div className='tile-number'>1223</div>
        </div>

        <div className='tile'>
          <h3 className='tile-header'>This Month</h3>
          <div className='tile-number'>22345</div>
        </div>
      </div>
    </div>
  )
}

export default HomeStats