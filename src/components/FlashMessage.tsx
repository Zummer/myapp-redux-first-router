import classnames from 'classnames';
import React from 'react';
import {EFlashMessageType} from '../Enums';
import {IFlashMessage} from '../Models';

interface IProps {
  message: IFlashMessage;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const FlashMessage: React.FunctionComponent<IProps> = ({
  message,
  onClick,
}: IProps) => {
  const {type, text} = message;

  return (
    <div
      className={classnames('alert', {
        'alert-success': type === EFlashMessageType.SUCCESS,
        'alert-danger': type === EFlashMessageType.ERROR,
      })}
    >
      <button onClick={onClick} className="close">
        &times;
      </button>
      {text}
    </div>
  );
};
