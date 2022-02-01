import React, { useEffect,useState } from "react";
import {AutoSizer, InfiniteLoader, Grid, ColumnSizer,List,ScrollSync} from 'react-virtualized';
import 'react-virtualized/styles.css';
import axios from 'axios';
import styles from './ScrollSync.example.css';
import scrollbarSize from 'dom-helpers/scrollbarSize';

const API_URL = "http://localhost:5000"

const ScrollSyncTable = (props) => {
    const {columns} = props;

    const [remoteRowCount,setRemoteRowCount] = useState(1);
    const [data,setData] = useState([]);
    const [isLoading,setIsLoading] = useState(false);


    useEffect(()=>{
        fetchData();
    },[])

    async function fetchData(startIndex=0,stopIndex=20) {
        
        
        const response = await axios.get(`${API_URL}/data?startIndex=${startIndex}&endIndex=${stopIndex}`);
        if (!!response.data) {
          const currentData = response.data.data
          let newData = [...data];
          currentData.map(e=>{
            newData[e.index]=e.data;
          })
          setData(newData) 
          setIsLoading(false)               
          setRemoteRowCount(response.data.totalRowCount)
        }
    }

    const cellRenderer = ({key,rowIndex,columnIndex,parent,style,isScrolling}) =>{

        const cellStyle = Object.assign({},style,{
            backgroundColor: rowIndex %2 ? "#fff":'#eee',
          });

        let content;
        console.log(data.length)
        if (rowIndex < remoteRowCount  ){
          
          
        
          content = (
            <div key = {key} style={cellStyle}>
              <div style={{padding:"20px"}}>
                
                {!!data[rowIndex]?data[rowIndex][columns[columnIndex]['keyVar']]:<div>Loading ...</div>}
              </div>
            </div>
          );
        }
  
        else if (columnIndex === 0){
          const cellStyle = Object.assign({},style,{
            textAlign: "center"
          });
          content = <div  key = {key} style= {cellStyle}>Loading ... </div>
        }
        else{
          content = <div key = {key}  style= {style}>Loading ... </div>
        }
        
        content = isScrolling?<div key={key} style={cellStyle}>...</div>:content;
        return content;
  
       
      }

    const isRowLoaded = ({ index }) => {
        return !!data[index]
        };

    const loadMoreRows = async ({ startIndex, stopIndex }) => 
    {
        console.log(startIndex, stopIndex)
        if (!isLoading){
            setIsLoading(true)            
            await fetchData(startIndex,stopIndex)
        }

    };
    const headerCellRenderer = ({key,rowIndex,columnIndex,parent,style}) =>{
        
        const content = (
            <div key={key} style={{...style,overflow:"hidden",border:"1px solid #eee",}}>
              <div style={{padding:"20px"}}>
                {columns[columnIndex]['name']}
              </div>
            </div>
          );

        return content
        
    }
    function rowRenderer ({ key, index, style}) {
        return (
          <div
            key={key}
            style={style}
          >
            {`Row ${index}`}
          </div>
        )
      }
  const state = { columnWidth: 105,
    columnCount: columns.length,
    height: 500,
    overscanColumnCount: 0,
    overscanRowCount: 5,
    rowHeight: 75,
}

    const {
        columnCount,
        columnWidth,
        height,
        overscanColumnCount,
        overscanRowCount,
        rowHeight,
      } = state;

    //   return (
    //     <InfiniteLoader
    //         isRowLoaded={isRowLoaded}
    //         loadMoreRows={loadMoreRows}
    //         rowCount={remoteRowCount}
    //         minimumBatchSize={500}
            
    //     >
    //             {({onRowsRendered,registerChild})=>(
    //                 <Grid
    //                 const onSectionRendered={({columnStartIndex,columnStopIndex,rowStartIndex,rowStopIndex})=>{
    //                     const startIndex = rowStartIndex * columnCount + columnStartIndex
    //                     const stopIndex = rowStopIndex * columnCount + columnStopIndex
                    
    //                     onRowsRendered({startIndex,stopIndex})

    //                 }}      
    //                 ref={registerChild}
    //                 columnWidth={columnWidth}
    //                 columnCount={columnCount}
    //                 height={height}
    //                 overscanColumnCount={overscanColumnCount}
    //                 overscanRowCount={overscanRowCount}
    //                 cellRenderer={cellRenderer}                  
    //                 rowHeight={rowHeight}
    //                 rowCount={remoteRowCount}
    //                 width={500}
    //             />
    //         )}                                
    //     </InfiniteLoader>
    // )
   
    return(
        <ScrollSync>
          {({
            clientHeight,
            clientWidth,
            onScroll,
            scrollHeight,
            scrollLeft,
            scrollTop,
            scrollWidth,
          }) => {
            
            return (
                <div className={styles.GridColumn}
                    style={{width:"100%"}}
                >
                  <AutoSizer disableHeight>
                    {({width}) => (
                      <div>
                        <div
                            style={{
                            backgroundColor: '#ccc',                            
                            height: rowHeight,
                            width: width - scrollbarSize(),
                          }}>
                          <Grid
                            className={styles.HeaderGrid}
                            columnWidth={columnWidth}
                            columnCount={columnCount}
                            height={rowHeight}
                            overscanColumnCount={overscanColumnCount}
                            cellRenderer={headerCellRenderer}
                            rowHeight={rowHeight}
                            rowCount={1}
                            scrollLeft={scrollLeft}
                            width={width - scrollbarSize()}
                            style={{overflow:'hidden'}}
                          />
                        </div>
                        <div
                          style={{
                            // backgroundColor: `rgb(${middleBackgroundColor.r},${middleBackgroundColor.g},${middleBackgroundColor.b})`,
                            // color: middleColor,
                            height,
                            width,
                          }}>
                            <InfiniteLoader
                                isRowLoaded={isRowLoaded}
                                loadMoreRows={loadMoreRows}
                                rowCount={remoteRowCount}
                                minimumBatchSize={500}
                            >
                                    {({onRowsRendered,registerChild})=>{
                                         const onSectionRendered = ({rowStartIndex,rowStopIndex})=>{
                                            onRowsRendered({
                                              startIndex:rowStartIndex,
                                              stopIndex:rowStopIndex
                                            })
                                          }
                                        //   const onSectionRendered=({columnStartIndex,columnStopIndex,rowStartIndex,rowStopIndex})=>{
                                        //     const startIndex = rowStartIndex * columnCount + columnStartIndex
                                        //     const stopIndex = rowStopIndex * columnCount + columnStopIndex
                                        
                                        //     onRowsRendered({startIndex,stopIndex})

                                        //     }     
                                        return <Grid
                                         
                                        onSectionRendered={onSectionRendered}
                                        ref={registerChild}
                                        columnWidth={columnWidth}
                                        columnCount={columnCount}
                                        height={height}
                                        onScroll={onScroll}
                                        overscanColumnCount={overscanColumnCount}
                                        overscanRowCount={overscanRowCount}
                                        cellRenderer={cellRenderer}                  
                                        rowHeight={rowHeight}
                                        rowCount={remoteRowCount}
                                        width={width - scrollbarSize()}
                                    />
                    }}                                
                            </InfiniteLoader>
                        </div>
                      </div>
                    )}
                  </AutoSizer>
                </div>
            );
          }}
        </ScrollSync>
    )

    


    
};


export default ScrollSyncTable;