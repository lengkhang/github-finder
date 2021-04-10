import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Select, Typography } from 'antd';
import RepositoriesTable from '../RepositoriesTable/RepositoriesTable';
import { searchRepositories, clearSearch } from '../../actions/repositories';

const { Option } = Select;
const { Text } = Typography;

const PAGE_SIZE = 20;

const SearchRepositories = () => {
  const { repositories: storeRepositories } = useSelector(state => state);
  const { isLoading, total, error } = storeRepositories;
  const dispatch = useDispatch();

  const [searchType, setSearchType] = useState('language');
  const [searchTexts, setSearchTexts] = useState([]);
  const [currentPage, setCurrentPage] = useState(undefined);

  const onSearch = async ({ texts, type, pageNo }) => {
    await dispatch(
      searchRepositories({
        texts: texts || searchTexts,
        type: type || searchType,
        pageNo: pageNo || currentPage,
        pageSize: PAGE_SIZE
      })
    );
  };

  const onSearchTypeChange = async searchType => {
    setSearchType(searchType);

    if (searchTexts.length) {
      await onSearch({ type: searchType });
    }
  };

  const onChange = async (data) => {
    setSearchTexts(data);

    if (data.length) {
      await onSearch({ texts: data });
      setCurrentPage(1);
    } else {
      await dispatch(clearSearch());
      setCurrentPage(undefined);
    }
  };

  const onPagination = async (page) => {
    setCurrentPage(page);

    await onSearch({ pageNo: page });
  };

  return (
    <>
      <div className="site-layout-background" style={{ padding: 24 }}>
        <Input.Group compact style={{ textAlign: 'center', verticalAlign: 'middle', height: '100%', lineHeight: '32px' }}>
          <Text style={{ marginRight: 8 }}>Search repositories:</Text>

          <Select
            mode="tags"
            defaultValue={[]}
            onChange={onChange}
            style={{ width: '50%', maxWidth: '400px' }}
          />

          <Select style={{ width: '150px' }} defaultValue={searchType} onChange={onSearchTypeChange}>
            <Option value="language">Language</Option>
            <Option value="topic">Topic</Option>
          </Select>
        </Input.Group>
      </div>

      <RepositoriesTable
        error={error}
        data={storeRepositories.items}
        isLoading={isLoading}
        total={total}
        currentPage={currentPage}
        onPagination={onPagination}
        pageSize={PAGE_SIZE}
      />
    </>
  );
};

export default SearchRepositories;