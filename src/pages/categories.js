import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'

import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function categories() {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    const [parentCategory, setParentCategory] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        axios.get('/api/categories').then(result => {
           setCategories(result.data);
        });
    }
   
    const saveCategory = async(e) => {
        e.preventDefault();

        const data = {
            name, 
            parentCategory, 
            properties: properties.map((item) => (
                {name: item.name, values: item.values.split(',')}
            ))}
        
        if(editedCategory) { //if we are editing...
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);

        } else { //if we are NOT editing...
            await axios.post('/api/categories', data);
        }  

        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    const editCategory = (category) => {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name, values}) => (
                {name,
                values: values.join(',')}
            )));
    }

    

    const deleteCategory = (category) => {
        const MySwal = withReactContent(Swal)
            MySwal.fire({
            title: <p>Are you sure?</p>,
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: 'Cancle',
            confirmButtonText: 'Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
            // didOpen: () => {
            // `MySwal` is a subclass of `Swal` with all the same instance & static methods
            // },
        }).then(async result => {
            if(result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
            // return MySwal.fire(<p>Shorthand works too</p>)
        })
    }

    const addProperty = () => {
        setProperties(prev => {
            return [...prev, {name:'',values:''}];
          });
    }
    

    const handlePropertyNameChange = (index,property,newName) => {
        // console.log({ property, index, newName });
        setProperties((prev) => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }


    const handlePropertyValuesChange = (index, property, newValues) => {
        setProperties((prev) => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }

    const removeProperty = (indexToRemove) => {
        setProperties((prev) => {
            return [...prev].filter((p, pIndex)=> {
                return pIndex !== indexToRemove;
            })
        })
    }   

  return (
    <Layout>
        <h1>Categories</h1>
        <label>{editedCategory ? `Edit Category ${editedCategory.name}` : 'Create New Category'}</label>
        <form onSubmit={saveCategory} >

            <div className='flex gap-1'>        
            <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className='mb-0' 
                type='text' 
                placeholder={'Category name'}
                />
                <select 
                    className='mb-0'
                    onChange={e => setParentCategory(e.target.value)}
                    value={parentCategory}
                    >
                    <option value=''>No Parent Category</option>
                    {categories.length > 0 && categories.map((category) => (
                        <option value={category._id}>{category.name}</option>
                    ))}
                </select>
                </div>
                {/* ----------------------------------- */}
                <div className='mb-2'>
                    <label className='block'>Properties</label>
                    <button 
                        type='button' 
                        className='btn-default text-sm'
                        onClick={addProperty}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                        Add New Property
                    </button>
                    {properties.length > 0 && properties.map((property,index) => (
                        <div className="flex gap-1 my-1">
                            <input type="text"
                                value={property.name}
                                className="mb-0"
                                onChange={(ev) => handlePropertyNameChange(index,property,ev.target.value)}
                                placeholder="property name (example: color)"/>
                            <input type="text"
                                className="mb-0"
                                onChange={(ev) => handlePropertyValuesChange(index,property,ev.target.value)}
                                value={property.values}
                                placeholder="values, comma separated"/>
                            <button
                                type='button' 
                                className='btn-red' 
                                onClick={() => removeProperty(index)}
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>

                                </button>
                        </div>
                    ))}
                </div>
            <div className='flex gap-1'>
                {editedCategory && (
                    <button 
                        type='button' 
                        onClick={() => {
                            setEditedCategory(null);
                            setName('');
                            setParentCategory('');
                            setProperties([]);
                            }} 
                        className='btn-default'>
                        Cancel
                    </button>
                )}
                <button type='submit' className='btn-primary py-1'>
                    Save
                </button>
            </div>
        </form>
    {/* -------------------------------- */}

    {!editedCategory && (

    <table className='basic mt-4'>
        <thead>
            <tr>
                <td>Cateory Name</td>
                <td>Parent Category</td>
                <td></td>
            </tr>
        </thead>
        <tbody>
            {categories.length > 0 ? categories.map((category) => (
                <tr>
                    <td>{category.name}</td>
                    <td>{category?.parent?.name}</td>
                    <td>
                        <button 
                            className='btn-default'
                            onClick={() => editCategory(category)}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            Edit
                            </button>
                        <button 
                            className='btn-red'
                            onClick={() => deleteCategory(category)}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Delete
                            </button>
                    </td>
                </tr>
            )) : 
            <h3 className=' text-blue-900 mt-2'>No Categories Yet...</h3>
            }
        </tbody>
    </table>
    )}
    {/* ------------------------------------- */}
    </Layout>
  )
}
