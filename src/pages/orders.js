import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
    })
  },[])

  return (
    <Layout>
      <h1>Orders</h1>
      <table className='basic'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 && orders.map((order) => (
            <tr>
              <td>{(new Date(order.createdAt)).toLocaleString()}</td>
              <td>
                {order.name} {order.email} <br/>
                {order.city} {order.postalCode}
                {order.country} <br/>
                {order.streetAddress}
              </td>
              <td>{order.line_items.map((line) => (
                <>
                  {line.price_data?.product_data?.name} x 
                  {line.quantity}<br/>
                  {/* {JSON.stringify(line)}<br/> */}
                </>
              ))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

export default OrdersPage