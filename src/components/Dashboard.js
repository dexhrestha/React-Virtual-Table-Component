import { Card } from 'antd';
import GridExample from './Lists/Paste';

const Dashboard = (props) => {

      const columns = [
      {
            title:'Name',
            dataIndex:'name',
            key:'name',
      },
      {
            title:'Age',
            dataIndex:'age',
            key:'age',
      },
      {
            title:'Address',
            dataIndex:'address',
            key:'address',
      }

      ]

      return (<GridExample />)
}

export default Dashboard;