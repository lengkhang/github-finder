import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Input, Select, Typography } from 'antd';
import RepositoriesTable from '../RepositoriesTable/RepositoriesTable';
import { searchRepositories, clearSearch } from '../../actions/repositories';

const { Content } = Layout;
const { Option } = Select;
const { Text } = Typography;

const SearchRepositories = () => {
  const { repositories: storeRepositories } = useSelector(state => state);
  const { isLoading, total } = storeRepositories;
  const dispatch = useDispatch();

  const [searchType, setSearchType] = useState('language');
  const [searchTexts, setSearchTexts] = useState([]);
  const [currentPage, setCurrentPage] = useState(undefined);
  // const [repositories, setRepositories] = useState(storeRepositories.items);

  const onSearch = async ({ texts, type }) => {
    await dispatch(
      searchRepositories({
        texts: texts || searchTexts,
        type: type || searchType
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

      // setRepositories([]);
    }
  };

  const onPagination = (page) => {
    setCurrentPage(page);
    //TODO: Dispatch search
  };

  // useEffect(() => {
  //   setRepositories(storeRepositories.items);
  // }, [storeRepositories.items]);

  console.log('==> currentPage:', currentPage);

  return (
    <Content style={{ margin: '0 16px' }}>
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
        data={storeRepositories.items}
        isLoading={isLoading}
        total={total}
        page={currentPage}
        onPagination={onPagination}
      />
    </Content>
  );
};

export default SearchRepositories;