import Layout from "@/components/Layout"
import axios from "axios";
import { useEffect, useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from 'sweetalert2';
import Spinner from "@/components/Spinner";

const AdminsPage = () => {
  const [email, setEmail] = useState('');
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addAdmin = (e) => {
    e.preventDefault();

    axios.post('/api/admins', {email}).then(res => {
      // console.log(res.data);
      const MySwal = withReactContent(Swal)
        MySwal.fire({
          title: 'Admin Created!',
          icon: 'success',
        })
      setEmail('');
      loadAdmins();
    }).catch(err => {
      const MySwal = withReactContent(Swal)
        MySwal.fire({
          title: 'Error!',
          text: err.response.data.message,
          icon: 'error',
        })
    })
  };

  const loadAdmins = () => {
    setIsLoading(true);

    axios.get('/api/admins').then(res => {
      // console.log(res.data);
      setAdmins(res.data)
      setIsLoading(false);
    })
  };

  useEffect(() => {
    loadAdmins();
  }, [])

  const deleteAdmin = (_id, email) => {
    const MySwal = withReactContent(Swal)
            MySwal.fire({
            title: <p>Are you sure?</p>,
            text: `Do you want to delete ${email}?`,
            showCancelButton: 'Cancle',
            confirmButtonText: 'Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if(result.isConfirmed) {
              axios.delete('/api/admins?_id='+_id).then(() => {
                const MySwal = withReactContent(Swal)
                  MySwal.fire({
                    title: <p>Successfuly deleted</p>,
                    text: `${email}`,
                    icon: 'success',
                  });
                  loadAdmins();
              });
            }
        })
  }
  return (
    <>
      <Layout>
        <h1>Admins</h1>
        <h2>Add New Admin</h2>
        <form onSubmit={addAdmin}>
          <div className="flex gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className="m-0" placeholder="Google Email"/>
            <button type="submit" className="btn-primary whitespace-nowrap">Add Admin</button>
          </div>
        </form>
        
        <h2>Existing Admins</h2>

        <table className="basic">
          <thead>
            <tr className="text-left">
              <th>Admin Google Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={2}>
                  <div className="py-4">
                    <Spinner/>
                  </div>
                </td>
              </tr>
            )}
            
              {admins.length > 0 && admins.map((user) => (
                <tr>
                  <td>{user.email}</td>
                  <td>
                    <button className="btn-red" onClick={() => deleteAdmin(user._id, user.email)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            
          </tbody>
        </table>
      </Layout>
    </>
  )
}

export default AdminsPage