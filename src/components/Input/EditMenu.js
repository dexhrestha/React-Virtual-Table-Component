import './styles.css';
import {UserOutlined} from '@ant-design/icons';
import { Menu, Dropdown,Button } from 'antd';

const EditMenu =  (props)=>{
    const {options,defaultValue} = props;
    // return <div> Edit Menu <ul>{options.map((row)=>row.value)}</ul> </div>
    const userMenu = (
    <Menu>
        <Menu.Item key="1">Item 1</Menu.Item>
        <Menu.Item key="2">Item 2</Menu.Item>
        <Menu.Item key="3">Item 3</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">Logout</Menu.Item>
    </Menu>
    );
    return <div>
        <Dropdown
        overlay={userMenu}>

        
        <Button
        style={{}}
        className="dropdown-btn"
        overlay={userMenu}
          >
        
      {defaultValue}

      </Button>
      </Dropdown>
    </div>
}

export default EditMenu;