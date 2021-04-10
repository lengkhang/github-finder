import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { SAMPLE_USERS, USER_ROLE } from '../../constants/user';
import { userSelected } from '../../actions/user';

const { Sider } = Layout;
const { SubMenu } = Menu;

const SideMenu = () => {
  const { user } = useSelector(state => state);
  const { current: currentUser } = user;
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  const users = SAMPLE_USERS.filter(user => user.role === USER_ROLE.USER);
  const admins = SAMPLE_USERS.filter(user => user.role === USER_ROLE.ADMIN);
  const initialUser = admins[0];

  useEffect(() => {
    if (!currentUser) {
      dispatch(userSelected(initialUser));
    }

  }, [currentUser]);

  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };

  const onUserSelected = ({ key }) => {
    const selectedUser = SAMPLE_USERS.find(user => user.id === key);

    dispatch(userSelected(selectedUser));
  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={initialUser.id} mode="inline" onSelect={onUserSelected}>
        <SubMenu key="sub1" icon={<UserOutlined />} title="Users">
          {
            users.map(({id, name}) => <Menu.Item key={id}>{name}</Menu.Item>)
          }
        </SubMenu>

        <SubMenu key="sub2" icon={<TeamOutlined />} title="Admins">
          {
            admins.map(({id, name}) => <Menu.Item key={id}>{name}</Menu.Item>)
          }
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default SideMenu;