import React from 'react';
import classnames from 'classnames';

interface IProps {
    field: string;
    value: string;
    label: string;
    error?: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextFieldGroup: React.FunctionComponent<IProps> = ({field, value, label, error, type, onChange}) => {
    return (
        <div className={classnames("form-group", {"has-error": error})}>
            <label className="control-label">{label}</label>
            <input
                name={field}
                type={type}
                className='form-control'
                value={value}
                onChange={onChange}
            />
            {error && <span className="help-block">{error}</span>}
        </div>
    )
}

TextFieldGroup.defaultProps = {
    type: 'text',
};
