import React, {useEffect, useState} from 'react';
import UsersList from '../components/usersList';
import ErrorModal from '../../shared/components/UIElements/errorModal';
import LoadingSpinner from '../../shared/components/UIElements/loadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
    const [loadedUsers, setLoadedUsers] = useState();

    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
                console.log(responseData)
                setLoadedUsers(responseData.users);
            } catch (err) {

            }
        }
        fetchUsers();
    },[sendRequest])

    return(
        <React.Fragment>
            <ErrorModal error = {error} onClear = {clearError}/>
            {isLoading && (
                <div className='center'>
                    <LoadingSpinner/>
                </div>
            )}
            {!isLoading && loadedUsers && <UsersList items = {loadedUsers}/>};
        </React.Fragment>
    ) 
}

export default Users;