import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Tag, Skeleton, Typography, Alert } from 'antd';
import { loadSearchHistory } from '../../actions/searchHistory';

const { Paragraph } = Typography;

const columns = [
  {
    title: 'User',
    dataIndex: 'userId',
    key: 'userId'
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
  const { searchHistory } = useSelector(state => state);
  const { error, isLoading } = searchHistory;
  const dispatch = useDispatch();

  const skeletonRows = 5;
  const rowKey = '_id';
  const skeletonData = new Array(skeletonRows).fill({}).map((value, index) => ({ [rowKey]: index }));
  const data = searchHistory.items;
  const total = data.total; //TODO: Backend to return total

  const onPageChange = () => {

  };

  useEffect(() => {
    dispatch(loadSearchHistory({}));
  }, []);

  return (
    <>
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
          current: currentPage,
          showSizeChanger: false,
          onChange: onPageChange
        }}
      />
    </>
  );
};

export default Report;