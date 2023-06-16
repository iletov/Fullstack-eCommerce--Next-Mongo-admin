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
              <th>Edit</th>
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
            <tr className="flex flex-col">
              {admins.length > 0 && admins.map((user) => (
                <tr>
                  <td>{user.email}</td>
                  <td></td>
                </tr>
              ))}
            </tr>
          </tbody>
        </table>
      </Layout>
    </>
  )
}

export default AdminsPage