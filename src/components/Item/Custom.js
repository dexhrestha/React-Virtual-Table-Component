import { useState } from "react";
import './styles.css';

const DivElement = (props) => {
    return (
        <div className="center">
            <li>{props.text}</li>
        </div>
    )
}

const Cell = (props) =>{

    const [tree,setTree] = useState(Array.from({length: 5}, () => Math.floor(Math.random() * 100)).map(e=>{return {data:e,height:e*3,width:e*2}}))
    
    
    return (
        <div>

        <button onClick={e=>setTree([...tree,...[Array.from({length: 1}, () => Math.floor(Math.random() * 100))].map(e=>{return {data:e,height:e*5,width:e*10}})])}>Add element</button>
        <ul>
        { tree.map(e=><DivElement text={e.data} />)}
        </ul>
        </div>
    )
}

export default Cell;