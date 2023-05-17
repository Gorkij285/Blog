import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

import styles from '../Registration/Registration.module.scss';
import { fetchUpdateProfile, clearError } from '../../store/profileSlice';
import { StoreState } from '../../types/types';

import stylesTwo from './Profile.module.scss';

function Profile() {
  const err: boolean | null = useSelector((state: StoreState) => state.profile.error);

  const dispatch = useDispatch();

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
    image: {
      value: '',
      isActive: false,
    },
  });

  const newUserDate = {
    user: {
      username: values.name.value,
      email: values.email.value,
      password: values.password.value,
      image: values.image.value,
    },
  };

  console.log(newUserDate);

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
    image: '',
  };

  validateObj = validate(values);

  const updateProf = () => {
    if (Object.values(validateObj).length <= 1) {
      dispatch(fetchUpdateProfile(newUserDate) as any).then((el: any) => {
        if (el.payload) {
          navigate('/');
          message.success('Profile updated!');
        } else {
          message.error('invalid data!');
        }
      });
    }
  };

  const navigate = useNavigate();

  return (
    <div className={styles.registration}>
      <div className={`${styles.box} ${stylesTwo.box}`}>
        <h2 className={styles.text}>Edit Profile</h2>

        <label htmlFor="input">Username</label>
        <input onChange={handleChange} id="name" type="text" placeholder="Username" />
        <span className={styles.validate}>{validateObj.name}</span>

        <label htmlFor="input">Email address</label>
        <input onChange={handleChange} id="email" type="email" placeholder="Email address" />
        <span className={styles.validate}>{validateObj.email}</span>

        <label htmlFor="input">Password</label>
        <input onChange={handleChange} id="password" type="password" placeholder="Password" />
        <span className={styles.validate}>{validateObj.password}</span>

        <label htmlFor="input">Avatar image (url)</label>
        <input onChange={handleChange} id="image" type="text" placeholder="url" />
        <span className={styles.validate}>{validateObj.image}</span>

        <button onClick={updateProf} className={`${styles.button} ${stylesTwo.button}`}>
          Save
        </button>
      </div>
    </div>
  );
}

export default Profile;

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

  if (!values.password.value) {
    errors.password = 'Required password';
  } else if (values.password.value.length < 8 || values.password.value.length > 40) {
    errors.password = 'The password must contain at least 8 characters and no more than 40';
  }
  const url = values.image.value;
  if (
    !/^((ftp|http|https):\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url) &&
    url.length > 0
  ) {
    errors.image = 'Invalid URL';
  }

  return errors;
};
