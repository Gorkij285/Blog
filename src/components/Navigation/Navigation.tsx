import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { togglePage } from '../../store/listSlice'
import { Pagination } from 'antd'
import { StoreState, RootState } from '../../types/types'

const Navigation = () => {
  const dispatch = useDispatch()

  const handlePageChange = (page: number) => {
    dispatch(togglePage(page))
  }

  const page: number = useSelector((state: StoreState) => state.list.page || 1)
  const data = useSelector((state: RootState) => state.list.data)
  const limit = useSelector((state: RootState) => state.list.limitData)

  if (data.length < 1) return <div></div>

  console.log(page, limit)
  return <Pagination current={page} total={limit} showSizeChanger={false} onChange={(page) => handlePageChange(page)} pageSize={5} />
}

export default Navigation
