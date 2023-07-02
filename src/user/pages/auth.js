import React, {useState, useContext} from "react";

import Card from "../../shared/components/UIElements/card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/button";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/errorModal";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import "./auth.css"

const Auth = () => {
    const auth = useContext(AuthContext);

    const [isLogin, setisLogin] = useState(true);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    )

    const switchModeHandler = () => {
        if(!isLogin) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            )
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    },
                    image: {
                        value: null,
                        isValid: false
                    }
                },
                false
            )
        }
        setisLogin(prevMode => !prevMode)
    }

    const authSubmitHandler = async event => {
        event.preventDefault();

        console.log(formState.inputs);

        if(isLogin) { 
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/login`,
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.userId, responseData.token);
            } catch (err) {

            }    
        } else {
            try { 
                const formData = new FormData();
                formData.append('name', formState.inputs.name.value);
                formData.append('email', formState.inputs.email.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
                    'POST',
                    formData
                );
                auth.login(responseData.userId, responseData.token);
            } catch (err) {
                
            }
        }
    }

    return (
        <React.Fragment>
            <ErrorModal error = {error} onClear = {clearError}/>
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay/>}
                <h2>Login Required</h2>
                <hr/>
                <form onSubmit={authSubmitHandler}>
                    {!isLogin && <Input
                        element = "input"
                        id = "name"
                        type = "text"
                        label = "Name"
                        validators = {[VALIDATOR_REQUIRE]}
                        errorText = "Please enter your name."
                        onInput = {inputHandler}
                    />
                    }
                    {!isLogin && <ImageUpload id = "image" center onInput = {inputHandler} errorText = "Please provide an image"/>}
                    <Input
                        element = "input"
                        id = "email"
                        type = "email"
                        label = "E-mail"
                        validators = {[VALIDATOR_EMAIL()]}
                        errorText = "Please enter a valid email address."
                        onInput = {inputHandler} 
                    />
                    <Input
                        element = "input"
                        id = "password"
                        type = "password"
                        label = "Password"
                        validators = {[VALIDATOR_MINLENGTH(8)]}
                        errorText = "Please enter a valid password (atleast 8 characters)."
                        onInput = {inputHandler} 
                    />
                    <Button type = "submit" disabled = {!formState.isValid}>{isLogin ? 'LOGIN' : 'SIGN UP'}</Button>
                </form>
                <Button inverse onClick = {switchModeHandler}>SWITCH TO {isLogin ? 'SIGN UP' : 'LOGIN'}</Button>
            </Card>
        </React.Fragment>
        
    )
};

export default Auth;