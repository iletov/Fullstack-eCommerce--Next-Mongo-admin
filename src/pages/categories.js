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
        <h1>categories</h1>
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
                                className='btn-default' 
                                onClick={() => removeProperty(index)}
                                >
                                Remove
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
                            className='btn-primary mr-1'
                            onClick={() => editCategory(category)}
                            >
                            Edit
                            </button>
                        <button 
                            className='btn-primary'
                            onClick={() => deleteCategory(category)}
                            >
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
