import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'

import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function categories() {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
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

        const data = {name, parentCategory}
        
        if(editedCategory) { //if we are editing...
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);

        } else { //if we are NOT editing...
            await axios.post('/api/categories', data);
        }  

        setName('');
        fetchCategories();
    }

    const editCategory = (category) => {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
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


  return (
    <Layout>
        <h1>categories</h1>
        <label>{editedCategory ? `Edit Category ${editedCategory.name}` : 'Create New Category'}</label>
        <form onSubmit={saveCategory} className='flex'>
            
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
            <button type='submit' className='btn-primary py-1'>
                Save
            </button>
        </form>
    {/* -------------------------------- */}

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
    {/* ------------------------------------- */}
    </Layout>
  )
}
