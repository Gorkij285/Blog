import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';

import { fetchUpdatePost } from '../../store/articleSlice';
import { fetchSoloArticle } from '../../store/postSlice';
import type { UpdatePostDataType, StoreState } from '../../types/types';
import { update } from '../../store/profileSlice';

import classes from './EditArticle.module.scss';

type FormValues = {
  title: string;
  description: string;
  body: string | number;
  tags: { tag: string }[];
};

const EditArticle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentArticle = useSelector((state: StoreState) => state.soloArticle.currentArticle);
  const post = JSON.parse(sessionStorage.getItem('post') as any);
  console.log(post, currentArticle);

  const id = useParams().id;

  useEffect(() => {
    async function asFunc(id: string) {
      await dispatch(fetchSoloArticle(id) as any);
      console.log('запрос прошел', id);
    }
    if (id) asFunc(id);

    return () => {
      window.sessionStorage.removeItem('post');
    };
  }, [id]);

  const tags = post.tagList;
  const tagsForUpdate = tags?.map((tag: string) => {
    return { tag: tag };
  });

  const defaultValues = {
    title: post.title,
    description: post.description,
    body: post.body,
    tags: tagsForUpdate,
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm<FormValues>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray<FormValues>({
    name: 'tags',
    control,
  });

  const onSubmit = handleSubmit((data) => {
    const { body, description, title, tags } = data;
    const tagArr = tags.map((tagObj) => {
      return tagObj.tag;
    });
    const authData: UpdatePostDataType = {
      updateData: {
        title: title,
        description: description,
        body: body,
        tagList: tagArr,
      },
      slug: id,
    };

    async function updatePostAndNavigate() {
      try {
        await dispatch(fetchUpdatePost(authData) as any);
        navigate('/');
        dispatch(update());
        message.success('Article updated!');
      } catch (error) {
        console.error(error);
        message.error('Failed to update article.');
      }
    }
    updatePostAndNavigate();
  });

  return (
    <div className={classes.wrapper}>
      <h2 className={classes.header}>Edit article</h2>
      <form className={classes.form} onSubmit={onSubmit}>
        <label className={classes.label}>
          Title
          <input
            style={errors.title ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
            placeholder="Title"
            {...register('title', {
              required: 'This field is requierd',
              minLength: {
                value: 3,
                message: 'Minimum 3 characters',
              },
              maxLength: {
                value: 100,
                message: 'Maximum 100 characters',
              },
            })}
          />
        </label>
        <div className={classes.error}>{errors.title && <p>{errors?.title.message}</p>}</div>

        <label className={classes.label}>
          Short description
          <input
            style={errors.description ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
            placeholder="Title
          "
            {...register('description', {
              required: 'This field is requierd',

              minLength: {
                value: 3,
                message: 'Minimum 3 characters',
              },
              maxLength: {
                value: 100,
                message: 'Maximum 100 characters',
              },
            })}
          ></input>
        </label>
        <div className={classes.error}>{errors.description && <p>{errors?.description.message}</p>}</div>

        <label className={classes.label}>
          Text
          <textarea
            style={errors.body ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
            placeholder="Text"
            {...register('body', {
              required: 'This field is requierd',
              minLength: {
                value: 3,
                message: 'Minimum 3 characters',
              },
              maxLength: {
                value: 4000,
                message: 'Maximum 4000 characters',
              },
            })}
          ></textarea>
        </label>
        <div className={classes.error}>{errors.body && <p>{errors?.body.message}</p>}</div>

        <div className={classes.tags}>
          <ul>
            {fields.map((field, index) => {
              return (
                <li key={field.id}>
                  <div className={classes.tags__wrapper}>
                    <label className={`${classes.label} ${classes.tag}`}>
                      <input
                        style={errors.tags ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
                        placeholder="Tag"
                        {...register(`tags.${index}.tag`, {
                          minLength: {
                            value: 2,
                            message: 'Minimum 2 characters',
                          },
                          required: 'Tags can not be empty',
                        })}
                      ></input>
                    </label>
                    <div className={classes.error}>{errors.tags && <p>{errors?.tags[index]?.tag?.message}</p>}</div>
                  </div>
                  <button className={classes.tags__delete} type="button" onClick={() => remove(index)}>
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>

          <button className={classes.tags__add} type="button" onClick={() => append({ tag: '' })}>
            Add tag
          </button>
        </div>

        <button className={classes.submit_btn}>Send</button>
      </form>
    </div>
  );
};

export default EditArticle;
