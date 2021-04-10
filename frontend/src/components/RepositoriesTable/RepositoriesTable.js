import React from 'react';
import { Table, Tag, Skeleton, Typography } from 'antd';

const { Paragraph } = Typography;

const PAGE_SIZE = 20;
const columns = [
  {
    title: 'Full name',
    dataIndex: 'full_name',
    key: 'full_name',
    render: (text, row) => <a target="_blank" href={row.html_url}>{text}</a>
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: 'Language',
    dataIndex: 'language',
    key: 'language'
  },
  {
    title: 'Topics',
    key: 'topics',
    dataIndex: 'topics',
    render: topics => (
      <>
        {
          topics.map(topic => {
            const color = topic.length > 5 ? 'geekblue' : 'green';

            return (
              <Tag color={color} key={topic}>
                {topic.toUpperCase()}
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

const RepositoriesTable = ({ data, isLoading, total, page, onPagination }) => {
  const skeletonRows = 5;
  const rowKey = 'id';
  const skeletonData = new Array(skeletonRows).fill({}).map((value, index) => ({ [rowKey]: index }));

  console.log('==> table-page:', page);

  const onPageChange = (page) => {
    onPagination(page);
  };

  return (
    <>
      <Paragraph style={{ textAlign: 'right' }}>
        { !isLoading && total ? `Showing ${PAGE_SIZE * (page - 1) + 1} - ${PAGE_SIZE * page} of ${total}` : <br /> }
      </Paragraph>

      <Table
        columns={isLoading ? generateSkeleton() : columns}
        dataSource={isLoading ? skeletonData : data}
        rowKey={rowKey}
        pagination={{
          total,
          pageSize: PAGE_SIZE,
          current: page,
          showSizeChanger: false,
          onChange: onPageChange
        }}
      />
    </>
  );
};

export default RepositoriesTable;