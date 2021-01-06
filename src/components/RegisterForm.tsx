import { debounce } from 'lodash';
import React from 'react';
import { AnyAction, Dispatch } from 'redux';
import { validateInput } from '../../server/shared/validations/register';
import {IUserRegisterParams} from '../Models';
import { TextFieldGroup } from './TextFieldGroup';

interface IState {
    data: IUserRegisterParams;
}

interface IProps {
    setErrors: (errors: any) => AnyAction;
    onRegister: (params: IUserRegisterParams) => Promise<void>;
    isLoading: boolean;
    errors: any;
}

export class RegisterForm extends React.Component<IProps, IState>{
    state = {
        data: {
            email: '',
            displayName: '',
            password: '',
            passwordRepeat: '',
        },
    };

    componentWillUnmount() {
        this.props.setErrors(null);
    }

    setErrors = debounce((errors) => {
        this.props.setErrors(errors);
    }, 300);

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const {data} = this.state;
        this.setState((prevState: IState) => {
            return {
                ...prevState,
                data: {
                    ...data,
                    [name]: value
                }
            };
        });

        const {errors} = this.props;

        if (errors && errors[name]) {
            const nextErrors = {};
            Object.keys(errors).filter(key => name !== key).forEach(key => {
                nextErrors[key] = errors[key];
            });
            this.setErrors(nextErrors);
        }
    }

    isValid = () => {
        const {setErrors} = this.props;
        const {errors, isValid} = validateInput(this.state.data);

        if (!isValid) {
            setErrors(errors);
        }

        return isValid;
    }

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const {onRegister} = this.props; 
        e.preventDefault(); // важно отменить действие по-умолчанию: перезагрузка страницы

        if (this.isValid()) {
            onRegister(this.state.data);
        }
    }

    render() {
        const {data} = this.state;
        const {errors, isLoading} = this.props;
        const {email, displayName, password, passwordRepeat} = data;

        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Присоединяйтесь!</h1>
                <TextFieldGroup
                    label="Логин (email)"
                    field="email"
                    value={email}
                    onChange={this.handleChange}
                    error={errors?.email}
                />
                <TextFieldGroup
                    label="Имя пользователя"
                    field="displayName"
                    value={displayName}
                    onChange={this.handleChange}
                    error={errors?.displayName}
                />
                <TextFieldGroup
                    label="Пароль"
                    field="password"
                    value={password}
                    onChange={this.handleChange}
                    error={errors?.password}
                />
                <TextFieldGroup
                    label="Повторите пароль"
                    field="passwordRepeat"
                    value={passwordRepeat}
                    onChange={this.handleChange}
                    error={errors?.passwordRepeat}
                />
                <div className="form-group">
                    <button
                        disabled={isLoading}
                        className="btn btn-primary btn-large"
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </form>
        )
    }
}
