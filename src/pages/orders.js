import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';
import Spinner from '@/components/Spinner';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
      setIsLoading(false);
    })
  },[])

  return (
    <Layout>
      <h1>Orders</h1>
      <table className='basic'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4}>
                <Spinner/>
              </td>
            </tr>
          )}
          {orders.length > 0 && orders.map((order) => (
            <tr key={order._id} className='text-center'>
              <td> 
                {(new Date(order.createdAt)).toLocaleString()}
              </td>
              <td className={order.paid ? 'text-green-600' : 'text-red-600'} >
                {order.paid ? 'Paid' : 'NO'}
              </td>
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