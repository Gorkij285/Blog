import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from 'antd';

import { togglePage } from '../../store/listSlice';
import { StoreState, RootState } from '../../types/types';

const Navigation = () => {
  const dispatch = useDispatch();

  const handlePageChange = (page: number) => {
    sessionStorage.setItem('page', String(page));
    dispatch(togglePage(page));
  };

  const page: number = useSelector((state: StoreState) => state.list.page || 1);
  const data = useSelector((state: RootState) => state.list.data);
  const limit = useSelector((state: RootState) => state.list.limitData);

  if (data.length < 1) return <div></div>;

  return (
    <Pagination
      current={Number(sessionStorage.getItem('page'))}
      total={limit}
      showSizeChanger={false}
      onChange={(page) => handlePageChange(page)}
      pageSize={5}
    />
  );
};

export default Navigation;
