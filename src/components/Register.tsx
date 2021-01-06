import React from 'react';
import {connect} from 'react-redux';
import {RegisterForm} from './RegisterForm';
import {userRegisterRequest, setFormErrors} from '../actions';
import { IAppState, IUserRegisterParams } from '../Models';
import { AnyAction } from 'redux';
import Loading from './Loading';

interface IStateProps {
    errors: any;
    isLoading: boolean;
}

interface IDispatchProps {
    setFormErrors: (errors: any) => AnyAction;
    userRegisterRequest: (userRegisterParams: IUserRegisterParams) => Promise<void>;
}

type TProps = IStateProps & IDispatchProps;

const Register: React.FunctionComponent<TProps> = ({userRegisterRequest, setFormErrors, errors, isLoading}) => {
    return (
        <div className="row">
            {isLoading && <Loading />}
            <div className="col-md-4 col-md-offset-4">
                <RegisterForm
                    setErrors={setFormErrors}
                    onRegister={userRegisterRequest}
                    isLoading={isLoading}
                    errors={errors}
                />
            </div>
        </div>
    );
}

const mapStateToProps = (state: IAppState): IStateProps => {
    const {errors, isLoading} = state.userRegister;
    return {
        errors,
        isLoading,
    };
}

export default connect(mapStateToProps, {userRegisterRequest, setFormErrors})(Register);
