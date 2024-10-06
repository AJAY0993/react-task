import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { User as UserType } from '../types'
import toast from 'react-hot-toast'
import { deleteUser as deleteUserApi, getUser } from '../api'
import Loader from '../components/Loader'
import ModalProvider, { useModalContext } from '../components/Modal'
import Form from '../components/Form'

function User() {
    const location = useLocation()
    const data: UserType = location.state?.user // Retrieve user data passed from the previous page (if any)
    const [user, setUser] = useState<UserType>(data) // Store user data
    const [loading, setLoading] = useState<boolean>(false) // Track loading state
    const [deleting, setDeleting] = useState<boolean>(false) // Track deleting state
    const navigate = useNavigate()
    const { id } = useParams() // Get user ID from route params
    const { close: closeModal } = useModalContext() // Access modal context functions

    // Delete user and handle the modal and redirect
    const deleteUser = async () => {
        try {
            setDeleting(true)
            await deleteUserApi(user?.id?.toString() || "")
            navigate('/') // Redirect to the homepage after deletion
        } catch (error) {
            const err = error as Error
            toast.error(err.message) // Show error notification
        } finally {
            setDeleting(false)
            closeModal() // Close the modal after the operation
        }
    }

    // Fetch user data if not provided by route location
    useEffect(() => {
        (async function () {
            if (!user) {
                try {
                    setLoading(true)
                    const user = await getUser(id || "")
                    setUser(user)
                } catch (error) {
                    const err = error as Error
                    toast.error(err.message) // Show error notification
                } finally {
                    setLoading(false)
                }
            }
        })()
    }, [])

    if (loading) return <Loader /> // Show loader while fetching user data
    if (!user) return 'User not found' // Show a message if no user is found

    return (
        <div className='p-2'>
            <div>
                <h2 className='font-medium text-xl'>{user.name}</h2>
            </div>
            <p><span className='font-medium'>Username: </span> @{user.username}</p>

            <address>
                {/* Display user contact details */}
                {user.website && <><a href={user.website}>{user.website}</a><br /></>}
                <a href={"mailto:" + user.email}>{user.email}</a><br />
                <a href={"tel:" + user.phone}>{user.phone}</a><br />
                <span className='font-medium'>Address: </span><br />
                {user?.address.suite || ""}<br />
                {user?.address.street || ""}<br />
                {user.address.city || ""}<br />
                USA <br />
            </address>

            {/* Display user company details */}
            <div>
                <p><span className='font-medium'>Company: </span> {user.company?.name || "Not specified"}</p>
                <blockquote>{user.company?.catchPhrase || ""}</blockquote>
                <p>{user.company?.bs || ""}</p>
            </div>

            {/* Modal buttons for Delete and Update actions */}
            <div className='my-4 flex gap-4'>
                <ModalProvider.Open id={'delete' + user.id}>
                    <button className='rounded p-2 min-w-24 text-center bg-red-600 text-white'>Delete</button>
                </ModalProvider.Open>

                {/* Delete confirmation modal */}
                <ModalProvider.Window id={'delete' + user.id}>
                    <div className='bg-white rounded-md p-4'>
                        <p className='mb-12'>
                            Are you sure you want to delete {user.name}?
                        </p>
                        <div className='flex gap-2 w-fit ml-auto'>
                            <button className='rounded p-2 min-w-24 text-center bg-black text-white' onClick={closeModal} disabled={deleting}>Cancel</button>
                            <button className='rounded p-2 min-w-24 text-center bg-red-600 text-white' onClick={deleteUser} disabled={deleting}>Delete</button>
                        </div>
                    </div>
                </ModalProvider.Window>

                <ModalProvider.Open id={'update' + user.id}>
                    <button className='rounded p-2 min-w-24 text-center bg-blue-400 text-white'>Update</button>
                </ModalProvider.Open>

                {/* Update form modal */}
                <ModalProvider.Window id={'update' + user.id}>
                    <Form mode='update' user={user} setUser={setUser} />
                </ModalProvider.Window>
            </div>
        </div>
    )
}

export default User
