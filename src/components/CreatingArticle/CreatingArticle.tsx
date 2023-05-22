import React, { useEffect, useState } from 'react';
import { Control, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { message } from 'antd';

import styles from '../Registration/Registration.module.scss';
import stylesButton from '../Header/Header.module.scss';
import { FormValues } from '../../types/types';
import { fetchCreatePost } from '../../store/articleSlice';
import { update } from '../../store/profileSlice';

import stylesTwo from './CreatingArticle.module.scss';

const CreatingArticle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    title: {
      value: '',
      isActive: false,
    },
    shortDescription: {
      value: '',
      isActive: false,
    },
    text: {
      value: '',
      isActive: false,
    },
    tags: [],
  });

  const {
    register,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: {
      cart: [{ name: '' }],
    },
  });

  function TotalAmout({ control }: { control: Control<FormValues> }) {
    const cartValues = useWatch({
      control,
      name: 'cart',
    });
    return cartValues;
  }
  const tagsList = TotalAmout({ control })
    .map((obj) => obj.name)
    .filter((str) => str !== '');

  let { fields, append, remove } = useFieldArray({
    name: 'cart',
    control,
    rules: {
      required: 'Please append at least 1 item',
    },
  });

  const validateObj = validate(values);

  const addArticle = () => {
    const arr = {
      title: values.title.value,
      description: values.shortDescription.value,
      body: values.text.value,
      tagList: tagsList,
    };
    let bool = true;
    function hasEmptyKeys(arr: any) {
      if (arr) {
        for (const key in arr) {
          if (Object.prototype.hasOwnProperty.call(arr, key) && arr[key] === '' && key !== 'tagList') {
            bool = false;
          }
        }
      }
    }
    hasEmptyKeys(arr);

    const masTags = fields.map((field) => field.name);

    if (masTags.includes('')) {
      message.error('tags cannot be empty!');
    } else {
      if (bool) {
        const updatePostAndNavigate = async () => {
          if (Object.values(validateObj).length < 1) {
            await dispatch(fetchCreatePost(arr) as any);
            dispatch(update());
            navigate('/');
            message.success('Article create!');
          } else {
            message.error('Failed to create article.');
          }
        };
        updatePostAndNavigate();
      }
    }
  };

  const handleChange = (event: any) => {
    const { value } = event.target;
    const id: string = event.target.id;
    setValues({
      ...values,
      [id]: {
        value: value.trim(),
        isActive: true,
      },
    });
  };

  const handleInputChange = (event: any, index: any) => {
    const { name, value } = event.target;
    const updatedFields = [...fields];
    updatedFields[index].name = value;
    fields = updatedFields;
  };

  return (
    <div className={`${styles.registration} ${stylesTwo.registration}`}>
      <div className={`${styles.box} ${stylesTwo.box}`}>
        <h2 className={styles.text}>Create new article</h2>

        <label htmlFor="input">Title</label>
        <input className={stylesTwo.title} onChange={handleChange} id="title" type="text" placeholder="Username" />
        <span className={styles.validate}>{validateObj.name}</span>

        <label htmlFor="input">Short description</label>
        <input
          className={stylesTwo.title}
          onChange={handleChange}
          id="shortDescription"
          type="text"
          placeholder="Short description"
        />
        <span className={styles.validate}>{validateObj.shortDescription}</span>

        <label htmlFor="input">Text</label>
        <textarea className={stylesTwo.title} id="text" placeholder="text" onChange={handleChange}></textarea>
        <span className={styles.validate}>{validateObj.text}</span>

        <div className={stylesTwo.tagsBox}>
          <div>
            {fields.map((field, index) => {
              return (
                <section key={field.id}>
                  <label>
                    <span>Tags</span>
                    <input
                      {...register(`cart.${index}.name`, { required: true })}
                      onChange={(event) => handleInputChange(event, index)}
                    />
                  </label>
                  <button
                    className={`${stylesTwo.delete} ${stylesButton.headerButton}`}
                    type="button"
                    onClick={() => remove(index)}
                  >
                    Delete
                  </button>
                </section>
              );
            })}
          </div>
          <div className={stylesTwo.addTagWrapper}>
            <button
              className={`${stylesTwo.addTag} ${stylesButton.headerButton}`}
              type="button"
              onClick={(el) => {
                append({
                  name: '',
                });
              }}
            >
              Add tag
            </button>
          </div>
        </div>
        <button onClick={addArticle} className={`${styles.button} ${stylesTwo.button}`}>
          Send
        </button>
      </div>
    </div>
  );
};

export default CreatingArticle;

const validate = (values: any) => {
  const errors: any = {};

  if (values.title.value.trim().length < 3) {
    errors.name = 'must consist of at least 3 characters';
  }

  if (values.shortDescription.value.trim().length < 3) {
    errors.shortDescription = 'must consist of at least 3 characters';
  }

  if (values.text.value.trim().length < 3) {
    errors.text = 'must consist of at least 3 characters';
  }

  return errors;
};
