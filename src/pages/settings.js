import Layout from '@/components/Layout'
import Spinner from '@/components/Spinner';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const SettingsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [featuredProductId, setFeaturedProductId] = useState('');
  const [shippingFee, setShippingFee] = useState('');


  useEffect(() => {
    setIsLoading(true);
    fetchAll().then(() => {
      setIsLoading(false);
    });
  }, [])

  const fetchAll = async () => {
    await axios.get('/api/products').then(res => {
      setProducts(res.data)
    });
    await axios.get('/api/settings?name=featuredProductId').then(res => {
      setFeaturedProductId(res.data.value)
    });
    await axios.get('/api/settings?name=shippingFee').then(res => {
      setShippingFee(res.data?.value);
    });
  }

  const saveSettings = async () => {
    setIsLoading(true);
    await axios.put('/api/settings', {
      name: 'featuredProductId',
      value: featuredProductId,
    });
    await axios.put('/api/settings', {
      name: 'shippingFee',
      value: shippingFee,
    });
    setIsLoading(false);
    const MySwal = withReactContent(Swal)
    MySwal.fire({
      title: 'Saved!',
      icon: 'success',
    })
  };

  return (
    <Layout>
      <h1>Settings</h1>
      {isLoading && (
        <Spinner />
      )}
      {!isLoading && (
        <>
          <label>Featured Product</label>
          <select value={featuredProductId} onChange={e => setFeaturedProductId(e.target.value)}>
            {products.length > 0 && products.map((product) => (
              <option key={product._id} value={product._id}>{product.title}</option>
            ))}
          </select>
          
          <label>Shipping price</label>
          <input type='number' value={shippingFee} onChange={e => setShippingFee(e.target.value)} />
          
          <div>
            <button className='btn-primary' onClick={saveSettings}>Save</button>
          </div>
        </>
      )}
      
    </Layout>
  )
}

export default SettingsPage