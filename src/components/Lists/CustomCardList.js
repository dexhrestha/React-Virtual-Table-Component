import { Card } from 'antd';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

const { Meta } = Card;

const CustomCardList = (props) =>{
   
    const [posts,setPosts] = useState([]);
    useEffect(e=>{
        axios.get('http://localhost:5000').then(
            ({data})=>{
                console.log(data)
                setPosts(data)}
        ).catch(err=>console.log('Error in fetching data'))
    },[])
    return (
        <div>
            {posts.map((e)=>{
                 
                 return(
                     
                 <Card 
                    hoverable
                    style={{width:240}}                    
                >
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    
                    <Meta  description={e.post}/>
                </Card>)
            })}
        </div>
    );
}

export default CustomCardList;