import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import styles from '../Registration/Registration.module.scss';
import { fetchLogin } from '../../store/profileSlice';
import { StoreState } from '../../types/types';

import stylesTwo from './LoginPage.module.scss';

const LoginPage = () => {
  const [values, setValues] = useState({
    email: {
      value: '',
      isActive: false,
    },
    password: {
      value: '',
      isActive: false,
    },
  });

  const dispatch = useDispatch();
  const err: boolean | null = useSelector((state: StoreState) => state.profile.error);
  const Logged: boolean = useSelector((state: StoreState) => state.profile.isLogged);

  const user = {
    email: values.email.value,
    password: values.password.value,
  };

  const getUser = () => {
    dispatch(fetchLogin(user) as any);
  };

  const handleChange = (event: any) => {
    const { value } = event.target;
    const id: string = event.target.id;
    setValues({
      ...values,
      [id]: {
        value: value,
        isActive: true,
      },
    });
  };

  let validateObj = {
    email: '',
    password: '',
    message: '',
  };

  if (err) {
    validateObj = validate(values);
  }

  const emailStyle = validateObj.email ? { border: '1px solid #F5222D' } : {};

  if (Logged) {
    return <Navigate replace to="/" />;
  }
  return (
    <div className={styles.registration}>
      <div className={`${styles.box} ${stylesTwo.loginPage}`}>
        <h2 className={styles.text}>Sign In</h2>

        <label htmlFor="input">Email address</label>
        <input
          className={stylesTwo.input}
          id="email"
          type="text"
          placeholder="Email address"
          onChange={handleChange}
          style={emailStyle}
        />
        <span className={styles.validate}>{validateObj.email}</span>

        <label htmlFor="input">Password</label>
        <input
          className={stylesTwo.input}
          id="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <span className={styles.validate}>{validateObj.message}</span>

        <button onClick={getUser} className={`${styles.button} ${stylesTwo.button}`}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

const validate = (values: any) => {
  const errors: any = {};

  if (!values.email.value) {
    errors.email = 'Required email';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email.value) && values.email.isActive) {
    errors.email = 'Invalid email address';
  }

  if (!values.password.value && values.password.isActive) {
    errors.password = 'Required password';
  } else if (values.password.value.length < 8 && values.password.isActive) {
    errors.password = 'Password must be at least 8 characters';
  }

  errors.message = 'invalid username or password';
  return errors;
};
