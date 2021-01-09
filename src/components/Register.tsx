import React from 'react';
import {connect} from 'react-redux';
import {RegisterForm} from './RegisterForm';
import {
  userRegisterRequest,
  setUserRegisterFormErrors,
} from '../actions/userRegister';
import {addFlashMessage} from '../actions/flashMessages';
import {IAppState, IFlashMessage, IUserRegisterParams} from '../Models';
import {AnyAction} from 'redux';
import Loading from './Loading';

interface IStateProps {
  errors: any;
  isLoading: boolean;
}

interface IDispatchProps {
  addFlashMessage: (message: IFlashMessage) => AnyAction;
  setFormErrors: (errors: any) => AnyAction;
  userRegisterRequest: (
    userRegisterParams: IUserRegisterParams
  ) => Promise<void>;
}

type TProps = IStateProps & IDispatchProps;

const Register: React.FunctionComponent<TProps> = (props: TProps) => {
  return (
    <div className="registerPage">
      {props.isLoading && <Loading />}
      <div className="col-md-4 col-md-offset-4">
        <RegisterForm {...props} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: IAppState): IStateProps => {
  const {errors, isLoading} = state.userRegister;
  return {
    errors,
    isLoading,
  };
};

export default connect(mapStateToProps, {
  userRegisterRequest,
  setFormErrors: setUserRegisterFormErrors,
  addFlashMessage,
})(Register);
