import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Tag, Skeleton, Typography, Alert } from 'antd';
import { loadSearchHistory } from '../../actions/searchHistory';
import { SAMPLE_USERS } from '../../constants/user';

const { Paragraph } = Typography;
const PAGE_SIZE = 20;

const columns = [
  {
    title: 'User',
    dataIndex: 'userId',
    key: 'userId',
    render: (userId) => SAMPLE_USERS.find(user => user.id === userId).name
  },
  {
    title: 'Searched at',
    dataIndex: 'createdAt',
    key: 'createdAt'
  },
  {
    title: 'Search type',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'Search text',
    key: 'texts',
    dataIndex: 'texts',
    render: texts => (
      <>
        {
          texts.map(text => {
            const color = text.length > 5 ? 'geekblue' : 'green';

            return (
              <Tag color={color} key={text}>
                {text.toUpperCase()}
              </Tag>
            );
          })
        }
      </>
    )
  }
];

const generateSkeleton = () => {
  return columns.map(column => ({
    ...column,
    render: () => <Skeleton
      paragraph={{ rows: 1, width: 50 }}
      active
      round/>
  }));
};

const Report = () => {
  const { searchHistory, user } = useSelector(state => state);
  const { current: currentUser } = user;
  const { error, isLoading, total } = searchHistory;
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const skeletonRows = 5;
  const rowKey = '_id';
  const skeletonData = new Array(skeletonRows).fill({}).map((value, index) => ({ [rowKey]: index }));
  const data = searchHistory.items;

  const onPageChange = (page) => {
    dispatch(loadSearchHistory({ pageNo: page, pageSize: PAGE_SIZE}));
    setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(loadSearchHistory({ pageSize: PAGE_SIZE}));
  }, [(currentUser || {}).id]);

  const maxPageResults = Math.min(total, PAGE_SIZE * currentPage);

  return (
    <div className="site-layout-background" style={{ padding: 24 }}>
      {
        error && <Alert message={`Error: ${error}`} type="error" />
      }
      <Paragraph style={{ textAlign: 'right' }}>
        { !isLoading && !error && total ? `Showing ${PAGE_SIZE * (currentPage - 1) + 1} - ${maxPageResults} of ${total}` : <br /> }
      </Paragraph>

      <Table
        columns={isLoading ? generateSkeleton() : columns}
        dataSource={isLoading ? skeletonData : data}
        rowKey={rowKey}
        pagination={{
          total,
          pageSize: PAGE_SIZE,
          showSizeChanger: false,
          onChange: onPageChange
        }}
      />
    </div>
  );
};

export default Report;