import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';

import { postProfile } from '../../store/profileSlice';
import { StoreState } from '../../types/types';

import styles from './Registration.module.scss';

const Registration = () => {
  const dispatch = useDispatch();

  const Logged: boolean = useSelector((state: StoreState) => state.profile.isLogged);

  const [values, setValues] = useState({
    name: {
      value: '',
      isActive: false,
    },
    email: {
      value: '',
      isActive: false,
    },
    password: {
      value: '',
      isActive: false,
    },
    repeatPassword: {
      value: '',
      isActive: false,
    },
    checkbox: false,
  });

  const newUser = {
    user: {
      username: values.name.value,
      email: values.email.value,
      password: values.password.value,
    },
  };

  const postProf = () => {
    const validates = validate(values);
    if (Object.values(validates).length <= 1) {
      dispatch(postProfile(newUser) as any).then((el: any) => {
        if (el.payload) {
          message.success('Profile created!');
        } else {
          message.error('incorrect data!');
        }
      });
    }
  };

  if (Logged) {
    return <Navigate replace to="/" />;
  }

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
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
    checkbox: '',
  };

  validateObj = validate(values);

  const nameStyle = validateObj.name ? { border: '1px solid #F5222D' } : {};
  const emailStyle = validateObj.email ? { border: '1px solid #F5222D' } : {};
  const passwordStyle = validateObj.password ? { border: '1px solid #F5222D' } : {};
  const repeatStyle = validateObj.repeatPassword ? { border: '1px solid #F5222D' } : {};

  return (
    <div className={styles.registration}>
      <div className={styles.box}>
        <h2 className={styles.text}>Create new account</h2>

        <label htmlFor="input">Username</label>
        <input id="name" type="text" placeholder="Username" onChange={handleChange} style={nameStyle} />
        <span className={styles.validate}>{validateObj.name}</span>

        <label htmlFor="input">Email address</label>
        <input id="email" type="email" placeholder="Email address" onChange={handleChange} style={emailStyle} />
        <span className={styles.validate}>{validateObj.email}</span>

        <label htmlFor="input">Password</label>
        <input id="password" type="password" placeholder="Password" onChange={handleChange} style={passwordStyle} />
        <span className={styles.validate}>{validateObj.password}</span>

        <label htmlFor="input">Repeat Password</label>
        <input
          id="repeatPassword"
          type="password"
          placeholder="Repeat Password"
          onChange={handleChange}
          style={repeatStyle}
        />
        <span className={styles.validate}>{validateObj.repeatPassword}</span>

        <div className={styles.checkbox}>
          <input type="checkbox" />
          <span className={styles.description}>I agree to the processing of my personal information</span>
        </div>
        <span className={styles.validate}>{validateObj.checkbox}</span>

        <button className={styles.button} onClick={postProf}>
          Create
        </button>

        <span className={styles.Already}>
          Already have an account?{' '}
          <Link to="/sign-up">
            <span className={styles.signIn}>Sign In.</span>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Registration;

const validate = (values: any) => {
  const errors: any = {};

  if (values.name.value.length < 1) {
    errors.name = 'Required name';
  }

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

  if (!values.repeatPassword.value && values.repeatPassword.isActive) {
    errors.repeatPassword = 'Required repeatPassword';
  } else if (values.repeatPassword.value !== values.password.value && values.password.isActive) {
    errors.repeatPassword = 'Passwords do not match';
  }

  if (values.checkbox) {
    errors.checkbox = 'You must agree.';
  }

  return errors;
};
