import React, { useEffect, useState } from 'react'
import Spinner from './Spinner';
import axios from 'axios';
import { subHours } from 'date-fns';

const HomeStats = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/orders').then(res => {
      setOrders(res.data);
      setIsLoading(false);
    })
  }, []);

  if (isLoading) {
    return (
      <Spinner />
    )
  };

  const ordersTotal = (orders) => {
    let sum = 0;
    console.log(orders);
    orders.forEach(element => {
      const {line_items} = element;
      line_items.forEach(item => {
        const lineItemSum = item.quantity * item.price_data.unit_amount / 100
        sum += lineItemSum;
      })
    });
    return new Intl.NumberFormat('en-US').format(sum);
  }

  const ordersToday = orders.filter(today => new Date(today.createdAt) > subHours(new Date, 24));
  const ordersThisWeek = orders.filter(today => new Date(today.createdAt) > subHours(new Date, 24 * 7));
  const ordersThisMonth = orders.filter(today => new Date(today.createdAt) > subHours(new Date, 24 * 30));

  return (
    <div>
      <h2>Orders</h2>

      <div className='tiles-grid'>
        <div className='tile'>
          <h3 className='tile-header'>Today</h3>
          <div className='tile-number'>{ordersToday.length}</div>
          <div className='tile-desc'>{ordersToday.length} orders today</div>
        </div>

        <div className='tile'>
          <h3 className='tile-header'>This Week</h3>
          <div className='tile-number'>{ordersThisWeek.length}</div>
          <div className='tile-desc'>{ordersThisWeek.length} orders this week</div>
        </div>

        <div className='tile'>
          <h3 className='tile-header'>This Month</h3>
          <div className='tile-number'>{ordersThisMonth.length}</div>
          <div className='tile-desc'>{ordersThisMonth.length} orders this month</div>
        </div>
      </div>
    {/* ----------------------------- */}
      <h2>Revenu</h2>

      <div className='tiles-grid'>
        <div className='tile'>
          <h3 className='tile-header'>Today</h3>
          <div className='tile-number'>$ {ordersTotal(ordersToday)}</div>
          <div className='tile-desc'>{ordersToday.length} orders today</div>
        </div>

        <div className='tile'>
        <div className='tile-number'>$ {ordersTotal(ordersThisWeek)}</div>
          <div className='tile-desc'>{ordersThisWeek.length} orders this week</div>
        </div>

        <div className='tile'>
        <div className='tile-number'>$ {ordersTotal(ordersThisMonth)}</div>
          <div className='tile-desc'>{ordersThisMonth.length} orders this month</div>
        </div>
      </div>
    </div>
  )
}


export default HomeStats