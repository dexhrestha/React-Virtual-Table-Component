import logo from './logo.svg';
import 'antd/dist/antd.css';
import './App.css';
import {Layout,Menu,Breadcrumb} from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import { useState } from 'react';

import ScrollSyncTable from './components/Tables/ScrollSync';


const {SubMenu} = Menu;
const {Header,Content,Sider}  = Layout;


function App() {

  const [sideCard,setSideCard] = useState(<div>Test Side Card</div>)

  // const columns = [
  //   {
  //   key:'name',
  //   colname:'name',
  //   name:'Name',
  //   },
  //   {
  //   key:'address',
  //   colname:'addrss',
  //   name:'Address',
  //   },
  //   {
  //   key:'subjId',
  //   colname:'subjId',
  //   name:'Subject ID of patient',
  //   },
  //   {
  //   key:'edit',
  //   colname:'edit',
  //   name:'Edit',
  //   render: (text) => text? <button>{text}</button>:text
  //   },
  //   ]

  const data = [
    {
      'name':'Dipesh Shrestha',
      'addrss':'Bhaktapur',
      'subjId':'Subj 001',
      'edit':'Edit'
    },
    {
      'name':'Dipesh Shrestha',
      'addrss':'Bhaktapur',
      'subjId':'Subj 001',
      'edit':'Edit'
    },
    {
      'name':'Dipesh Shrestha',
      'addrss':'Bhaktapur',
      'subjId':'Subj 001',
      'edit':'Edit'
    },
    {
      'name':'Dipesh Shrestha',
      'addrss':'Bhaktapur',
      'subjId':'Subj 001',
      'edit':'Edit'
    },
  ]

  const dataURL = ''
  const columns = [{'name':'Variable Name','keyVar':'col1'},{'name':'Role','keyVar':'col2'},{'name':'Type','keyVar':'col3'},{'name':'Name','keyVar':'col4'},{'name':'Name','keyVar':'col4'},{'name':'Name','keyVar':'col4'},]

  return (
      <div style={{height:'700px',width:'100%'}}>
      <ScrollSyncTable columns={columns} />
      </div>
   
  )
  return (
    <div className="App" >
      <Layout  >
        <Header className='header'>
          <h1 style={{color:'white'}}>Dashboard</h1>
        </Header>
      </Layout>
      <Layout>
        <Sider width={200} className='site-layout-background'>
          <Menu 
          mode='inline'
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{height:'100%',borderRight:0}}>
            <SubMenu key="sub1" icon={<UserOutlined />} title="SubMenu 1">
              <Menu.Item key="opt11">Option 1 1</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<UserOutlined />} title="SubMenu 2">
              <Menu.Item key="opt21">Option 2 1</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" icon={<UserOutlined />} title="SubMenu 3">
              <Menu.Item key="opt31">Option 3 1</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{padding:'0 24px 24px'}}>
          <Breadcrumb style={{margin:'16px 0'}}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
          <Content
          className="site-layout-background"
          style={{
            display:'flex',
            padding: 24,
            margin: 0,
            minHeight: 280,
            height:"80vh"
          }}
        >

          <Dashboard setSideCard={setSideCard} />

          {/* {<img src = "http://127.0.0.1:5000/static/img/temp/thecodergeek_2753648563070513218.jpg" alt='sr'/>} */}
        </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
