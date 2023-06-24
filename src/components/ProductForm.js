import axios from 'axios';
import { useRouter } from 'next/router';
import React, {useEffect, useState} from 'react'
import Spinner from './Spinner';
// import { ReactSortable } from 'react-sortablejs';


export default function ProductForm({ 
  _id, 
  title:existingTitle, 
  description:existingDescription, 
  price:existingPrice, 
  images:existingImages, 
  category:assignedCategory, 
  properties:assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [images, setImages] = useState(existingImages || []);
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState( existingPrice || '');
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(assignedCategory || '');
  const [productProperties, setProductProperties] = useState(assignedProperties || {});

  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }, []);

  const saveProduct = async (e) => {
    e.preventDefault();
    const data = {title, description, price, images, category, properties:productProperties};

    if(_id) {
      // UPDATE Product
      await axios.put('/api/products', {...data,_id})

    } else {
      // CREATE Product
      await axios.post('/api/products', data) // POST Method 
    }
    setGoToProducts(true); // to redirect in both scenarios..
    

    if(goToProducts) {
      router.push('/products');
    }
  }

  const uploadImages = async (e) => {
    // console.log(e)
    const files = e.target?.files;
    if(files?.length > 0) {
      setIsUploading(true);

      const data = new FormData();

      for (const file of files) {
        data.append('file', file)
      }
      const res = await axios.post('/api/upload', data);
      // console.log(res.data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links]; // All links + new links
      });
      setIsUploading(true);
    }
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let selectedCategoryInfo = categories.find(({_id}) => _id === category)
    
    propertiesToFill.push(...selectedCategoryInfo.properties);

    while(selectedCategoryInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === selectedCategoryInfo?.parent?._id);

      propertiesToFill.push(...parentCat.properties);
      selectedCategoryInfo = parentCat;
    }
     
  }

  const handleProductProp = (propName, value) => {
    setProductProperties((prev) => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    })
  }
  

  return (
      <form onSubmit={saveProduct}>
      
        <label>Product Name</label>
        <input type='text' placeholder='Product Name' value={title} onChange={(e) => setTitle(e.target.value)}/>

        <label>Category</label>
        <select
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value=''>Uncategorized</option>
          {categories.length > 0 && categories.map((item) => (
            <option key={item._id} value={item._id}>{item.name}</option>
          ))}
        </select>

        {/* ----------- make the child category inherit the parent category properties------- */}
          {propertiesToFill.length > 0 && propertiesToFill.map((item) => (
            <div key={item.name}>
              <div>
                <label>{item.name}</label>
              </div>
              <select 
                value={productProperties[item.name]}
                onChange={(e) => handleProductProp(item.name, e.target.value)}>
                {item.values.map((valueItem) => (
                  <option value={valueItem}>
                    {valueItem}
                  </option>
                ))}
              </select>
            </div>
          ))}
        {/* --------------------------------- */}

        <label>
          Photos
        </label>
        <div className='mb-2 flex flex-wrap gap-1'>
          
            {!!images?.length && images.map((link) => (
              <div key={link} className='h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200'>
                <img src={link} alt='' className='rounded-lg' />
              </div>
            ))}

          {isUploading && (
            <div className='h-24 flex items-center'>
              <Spinner />
            </div>
          )}

          <label className='w-24 h-24 flex flex-col justify-center bg-white shadow-sm border border-primary text-sm gap-1 text-primary items-center rounded-sm bg-gray-200 cursor-pointer'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 ">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
            <div>
              Add Image
            </div>
            <input type='file' onChange={uploadImages} className='hidden'></input>
          </label>
          
        </div>

        <label>Description</label>
        <textarea placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

        <label>Price (in USD)</label>
        <input type='number' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)}/>

        <button type='submit' className='btn-primary'>Save</button>
      </form>
  )
}