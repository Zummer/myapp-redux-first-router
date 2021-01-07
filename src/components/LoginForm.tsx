import {debounce} from 'lodash';
import React from 'react';
import {AnyAction} from 'redux';
import {EFlashMessageType} from '../Enums';
import {validateInput} from 'server/shared/validations/login';
import {IFlashMessage, ILoginParams} from '../Models';
import {TextFieldGroup} from './TextFieldGroup';
import {v4 as uuid} from 'uuid';

interface IState {
  data: ILoginParams;
}

interface IProps {
  addFlashMessage: (message: IFlashMessage) => AnyAction;
  setFormErrors: (errors: any) => AnyAction;
  login: (params: ILoginParams) => Promise<void>;
  isLoading: boolean;
  errors: any;
}

export class LoginForm extends React.Component<IProps, IState> {
  state = {
    data: {
      email: '',
      password: '',
    },
  };

  componentWillUnmount() {
    this.props.setFormErrors(null);
  }

  setErrorsDebounce = debounce(this.props.setFormErrors, 300);

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const {data} = this.state;
    this.setState((prevState: IState) => {
      return {
        ...prevState,
        data: {
          ...data,
          [name]: value,
        },
      };
    });

    const {errors} = this.props;

    if (errors && errors[name]) {
      const nextErrors = {};
      Object.keys(errors)
        .filter((key) => name !== key)
        .forEach((key) => {
          nextErrors[key] = errors[key];
        });
      this.setErrorsDebounce(nextErrors);
    }
  };

  isValid = () => {
    const {setFormErrors, addFlashMessage} = this.props;
    const {errors, isValid} = validateInput(this.state.data);

    if (!isValid) {
      setFormErrors(errors);
      addFlashMessage({
        id: uuid(),
        type: EFlashMessageType.ERROR,
        text: 'Вход не удался!',
      });
    }

    return isValid;
  };

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const {login} = this.props;
    e.preventDefault(); // важно отменить действие по-умолчанию: перезагрузка страницы

    if (this.isValid()) {
      login(this.state.data);
    }
  };

  render() {
    const {data} = this.state;
    const {errors, isLoading} = this.props;
    const {email, password} = data;

    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Вход</h1>
        <TextFieldGroup
          label="Логин (email)"
          field="email"
          value={email}
          onChange={this.handleChange}
          error={errors?.email}
        />
        <TextFieldGroup
          label="Пароль"
          field="password"
          value={password}
          onChange={this.handleChange}
          error={errors?.password}
        />
        <div className="form-group">
          <button disabled={isLoading} className="btn btn-primary btn-large">
            Войти
          </button>
        </div>
      </form>
    );
  }
}
