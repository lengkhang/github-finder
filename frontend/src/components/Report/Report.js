import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Tag, Skeleton, Typography, Alert } from 'antd';
import { loadSearchHistory } from '../../actions/searchHistory';
import { SAMPLE_USERS } from '../../constants/user';

const { Paragraph } = Typography;

const columns = [
  {
    title: 'User',
    dataIndex: 'userId',
    key: 'userId',
    render: (userId) => SAMPLE_USERS.find(user => user.id === userId).name
  },
  {
    title: 'Search type',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'Searched at',
    dataIndex: 'createdAt',
    key: 'createdAt'
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

const Report = ({ pageSize = 20, currentPage = 1 }) => {
  const { searchHistory, user } = useSelector(state => state);
  const { current: currentUser } = user;
  const { error, isLoading } = searchHistory;
  const dispatch = useDispatch();
  // const { currentPage, setCurrentPage }

  const skeletonRows = 5;
  const rowKey = '_id';
  const skeletonData = new Array(skeletonRows).fill({}).map((value, index) => ({ [rowKey]: index }));
  const data = searchHistory.items;
  const total = data.total; //TODO: Backend to return total

  const onPageChange = (page) => {
    //TODO: Call searchHistory endpoint with pagination
    console.log('==> page', page);
  };

  useEffect(() => {
    dispatch(loadSearchHistory({}));
  }, [currentUser.id]);

  return (
    <div className="site-layout-background" style={{ padding: 24 }}>
      {
        error && <Alert message={`Error: ${error}`} type="error" />
      }
      <Paragraph style={{ textAlign: 'right' }}>
        { !isLoading && !error && total ? `Showing ${pageSize * (currentPage - 1) + 1} - ${pageSize * currentPage} of ${total}` : <br /> }
      </Paragraph>

      <Table
        columns={isLoading ? generateSkeleton() : columns}
        dataSource={isLoading ? skeletonData : data}
        rowKey={rowKey}
        pagination={{
          total,
          pageSize: pageSize,
          // current: currentPage,
          showSizeChanger: false,
          onChange: onPageChange
        }}
      />
    </div>
  );
};

export default Report;