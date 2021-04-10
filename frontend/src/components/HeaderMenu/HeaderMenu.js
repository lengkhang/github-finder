import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Layout, Menu } from 'antd';
import { USER_ROLE } from '../../constants/user';

const { Header } = Layout;

const HeaderMenu = () => {
  const { user } = useSelector(state => state);
  const { current: currentUser } = user;
  const { name, role } = currentUser || {};

  return (
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">
          Search
          <Link to="/" />
        </Menu.Item>

        {
          role === USER_ROLE.ADMIN ?
            <Menu.Item key="2">
                Reports
              <Link to="/report" />
            </Menu.Item> :
            null
        }

        <span style={{ color: 'white', float: 'right' }}>{`Welcome ${name}`}</span>
      </Menu>
    </Header>
  );
};

export default HeaderMenu;