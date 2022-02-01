import {Table,AutoSizer,Column,InfiniteLoader, List,Grid, CellMeasurerCache, CellMeasurer, WindowScroller} from 'react-virtualized';
import { Card,Skeleton } from 'antd';
import { Avatar,List as AntList } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { createRef, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import 'react-virtualized/styles.css';



const LOADING=1;
const LOADED=2;
const API_URL = "http://localhost:5000"
const { Meta } = Card;
const {Item} = AntList;

let itemStatusMap = {};
let currentData=[];
let data = [];

const VirtualList = (props) => {

    const columns = {props}
    const [remoteRowCount,setRemoteRowCount] = useState(1)
    const [data,setData] = useState([])
    const [state,setstate] = useState({
      columnCount:3,
      columnWidth:100,
      isLoading:false
    })

    let lastLoadingIndex;
    const grid = useRef()

    let cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 30
    });
    
    
    const cellRenderer = ({key,rowIndex,columnIndex,parent,style}) =>{
      const {columnCount,columnWidth}  = {state}
      let content;
   
      if (rowIndex < remoteRowCount  ){
        const cellStyle = Object.assign({},style,{
          backgroundColor: rowIndex %2 ? "#fff":'#eee'
        });
        
        content = (
          <div style={cellStyle}>
            <div style={{padding:"20px"}}>
              {data[rowIndex]?data[rowIndex][`col${columnIndex+1}`]:<div></div>}
            </div>
          </div>
        );
      }
      else if (columnIndex === 0){
        lastLoadingIndex = rowIndex;

        const cellStyle = Object.assign({},style,{
          width: columnWidth * columnCount,
          textAlign: "center"
        });
        console.log(columnIndex)
        content = <div style= {cellStyle}>Loading ... </div>
      }
      else{
        content = <div style= {style}>Loading ... </div>
      }

      return (
        <CellMeasurer
          key = {key}
          cache = {cache}
          parent={parent}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
        >
          {content}
        </CellMeasurer>
      )

     
    }
  
    const onResize = ({width,height})=>{
      const {columnCount} = state;

      setstate({
        ...state,
        columnWidth: (width-30)/columnCount
      })
      
      cache.clearAll();
      if(!!grid.current){console.log("tset")}
    }

    

    async function fetchData(startIndex=0,stopIndex=20) {
    
      const response = await axios.get(`${API_URL}/data?startIndex=${startIndex}&endIndex=${stopIndex}`);
      if (!!response.data) {
        const currentData = response.data.data
        const newData = [...data];
        currentData.map(e=>{
          newData[e.index]=e.data;
        })
        setData(newData) 
        setstate({...state,isLoading:false})               
        setRemoteRowCount(response.data.totalRowCount)
      }
  }

    const isRowLoaded = ({ index }) => {
       return data[index]!==undefined
       };
        
    const loadMoreRows = async ({ startIndex, stopIndex }) => 
    {

      const {isLoading} = state;

        if (!isLoading){
          setstate({...state,isLoading:true})
          
          await fetchData(startIndex,stopIndex)

        }

    };



    // const rowRenderer = ({ key, index, style }) => {
    //     let label;        
    //     // label = !!data[index]?<div key={data[index].col2} style={style}>{`${data[index].col1} ${data[index].col2} ${data[index].col3} `}</div>:<Skeleton.Input key={index} active={true} style={style} />
    //     label = !!data[index]?data[index]:{'col1':'Loading','col2':'Loading'}
    //    return label
    // }
      return  (  
          <InfiniteLoader 
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={remoteRowCount}
          minimumBatchSize={10}
          threshold={10}
          >
            {({onRowsRendered,registerChild})=>{
              const onSectionRendered = ({rowStartIndex,rowStopIndex})=>{
                onRowsRendered({
                  startIndex:rowStartIndex,
                  stopIndex:rowStopIndex
                })
              }
              return(
                
                    <AutoSizer  disableHeight onResize={onResize}>
                    {({width})=>(
                      <Grid                      
                      width={width}
                      height={700}
                      // scrollTop={scrollTop}
                      ref={registerChild}
                      columnWidth={state.columnWidth}
                      columnCount={state.columnCount}
                      rowCount={remoteRowCount}
                      rowHeight={100}
                      cellRenderer={cellRenderer}
                      onSectionRendered={onSectionRendered}
                      />
                    )}
                  </AutoSizer> 
                                   
                 
              ) 
            }
            }
          </InfiniteLoader>


      );
}

export default VirtualList;