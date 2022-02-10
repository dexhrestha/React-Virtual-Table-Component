import { useState,useCallback } from "react";
import {debounce, max, min, sum} from "lodash";
import Draggable from "react-draggable";
import {
  CellMeasurer,
  CellMeasurerCache,
  Grid,
  AutoSizer,
  ColumnSizer,
  InfiniteLoader,
  ScrollSync
} from "react-virtualized";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import "react-virtualized/styles.css"; // only needs to be imported once
import "./styles.css";
import faker from "faker";
import scrollbarSize from "dom-helpers/scrollbarSize";

import EditMenu from "../Input/EditMenu";
// In this example, average cell width is assumed to be about 100px.
// This value will be used for the initial `Grid` layout.
// Cell measurements smaller than 75px should also be rounded up.
// Height is not dynamic.
const bodyCellcache = new CellMeasurerCache({
  defaultWidth: 100,
  fixedWidth: true,
  minHeight: 50,
  maxHeight: 100,
  minWidth: 70,
});
const headerCellcache = new CellMeasurerCache({
  defaultWidth: 100,
  minHeight: 50,
  maxHeight: 100,
  fixedHeight: true,
  minWidth: 70,
});
const MAXCELLWIDTH = 200;
const ROWCOUNT = 100;
const columns = [
  {
    name: "Name",
    keyVar: "name"
  },
  {
    name: "On Leave",
    keyVar: "onLeave",
    render: (t) => (t ? <CheckOutlined /> : <CloseOutlined />),
    edit: (t)=><EditMenu defaultValue={t ? <CheckOutlined /> : <CloseOutlined />} options={[{key:true,value:<CheckOutlined />},{key:false,value:<CloseOutlined />},]}/>,
    width:100
  },
  
  { name: "Email", keyVar: "email" ,width:300},
  { name: "Address", keyVar: "address"},
    
];
const list = [...Array(ROWCOUNT).keys()].map(() => {
  return {
    name: faker.name.findName(),
    address: faker.address.city(),
    email: faker.internet.email(),
    onLeave: Math.random() < 0.5
  };
}).map(row=>{
  return {
    ...row,
    onLeave : Math.random() < 0.2 ?'':true
  }
});


const STATUS_LOADED = 1;
const STATUS_LOADING = 0;
let totalWidth;
let isColDragging = false;
const VirtualTable = (props) => {
  
  const [data, setData] = useState({});
  const [loadedRows, setloadedRows] = useState([]);
  const [editCell,setEditCell] = useState({row:null,column:null})
  const defaultColWidth = Object.assign({},...columns.map(x=>({[x.name]:!!x.width?x.width:200})))
  const [colWidth,setColWidth] = useState(defaultColWidth)
  const handleDbClick = (e,rowIndex,columnIndex)=>{
    e.preventDefault()
    setEditCell({row:rowIndex,column:columnIndex})
  }  
  const resizeRow = ({columnIndex,deltaX})=>{
    headerCellcache.clearAll()
    bodyCellcache.clearAll()
    const dataKey = columns[columnIndex]['name']
    const prevWidths = {...colWidth}
    const percentDelta = deltaX;
    const nextKey = !!columns[columnIndex+1]?columns[columnIndex+1]['name']:null
    console.log(nextKey)
    // console.log(headerCellcache)
    setColWidth({
      ...colWidth,
      [dataKey]:min([max([prevWidths[dataKey]+percentDelta,headerCellcache._minWidth]),MAXCELLWIDTH]),
      [nextKey]:min([max([prevWidths[nextKey]-percentDelta,headerCellcache._minWidth]),MAXCELLWIDTH])
    })
  }
  const headercellRenderer = ({
    columnIndex,
    key,
    parent,
    rowIndex,
    style
  }) => {
    return (
      <CellMeasurer
        cache={headerCellcache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          style={{
            ...style,
            wordWrap: "normal"
          }}
          className="headerCell"
        >
          {columns[columnIndex]["name"]}
          <Draggable
            axis='x'
            defaultClassName="DragHandle"
            defaultClassNameDragging="DragHandleActive"
            onStart={()=>{isColDragging=true}}
            onDrag={(event,{deltaX})=>{
              resizeRow({columnIndex,deltaX})
            }}
            onStop={()=>{isColDragging=false}}
            position = {{x:0}}
            zIndex={999}
          >
            <span className="DragHandleIcon">:</span>
          </Draggable>
        </div>
      </CellMeasurer>
    );
  };
  const cellRenderer = ({ columnIndex, key, parent, rowIndex, style }) => {
    // const content // Derive this from your data somehow

    let content;
    const colname = columns[columnIndex]["keyVar"];
    if (loadedRows[rowIndex] === STATUS_LOADED) {
      const row = data[rowIndex];
      if (!!row) {
        const text = row[colname];
        if(editCell.row===rowIndex && editCell.column===columnIndex){
          if (!!columns[columnIndex]["edit"]){
            const editFunc = columns[columnIndex]['edit']
            content = editFunc(text);
          }else{
            if (!!columns[columnIndex]["render"]) {
              const renderFunc = columns[columnIndex]["render"];
              content = renderFunc(text);
            } else {
              content = text;
            }
          }
        }
        else{
          if (!!columns[columnIndex]["render"]) {
            const renderFunc = columns[columnIndex]["render"];
            content = renderFunc(text);
          } else {
            content = text;
          }
        }
      
      } else {
        content = <div>Loading .... </div>;
      }
    } else {
      content = <div>Loading .... </div>;
    }

    const className = "cell " + (rowIndex % 2) === 0 ? "oddRow" : "evenRow";
    const backgroundColor = rowIndex%2==0?"#fff":"#eee"
    
    return (
      <CellMeasurer
        cache={bodyCellcache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          style={{
            ...style,
            backgroundColor,
            wordWrap: "normal"
          }}
          className={className}
          onDoubleClick={(e)=>handleDbClick(e,rowIndex,columnIndex)}
        >
          {content}
        </div>
      </CellMeasurer>
    );
  };

  const isRowLoaded = (index) => {
    return !!loadedRows[index];
  };

  const loadMoreRows = ({ startIndex, stopIndex }) => {
    console.log("loadmore RowS");
    const loadedRowsMap = [...loadedRows];
    const newData = [];
    for (var i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADING;
    }

    setTimeout(() => {
      for (var i = startIndex; i <= stopIndex; i++) {
        newData[i] = list[i];
      }
      setData(newData);
    }, 1);

    for (var i = startIndex; i <= stopIndex; i++) {
      loadedRowsMap[i] = STATUS_LOADED;
    }

    setloadedRows(loadedRowsMap);
  };

  const resizeGrid = ({ height, width }) => {
    headerCellcache.clearAll();
    bodyCellcache.clearAll();
  };

  const getColumnWidth = (index,columnWidth)=>{

    const key = columns[index]['name']
    // if (isColDragging===true){
    //   return colWidth[key]
    // }
    // setColWidth({...colWidth,[columns[index]['name']]:columnWidth})  
    return min([ colWidth[key],MAXCELLWIDTH])
    
  }

  return (
    <div className="App" onDoubleClick={e=>e.preventDefault()} onKeyDown={useCallback(debounce(e=>e.key=='Escape'?setEditCell({row:null,column:null}):console.log(e.key),1000),[])}>
      <h1>Grid with CellMeasurer Example 2</h1>
      <div className="container">
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={loadMoreRows}
          rowCount={ROWCOUNT}
        >
          {({ registerChild, onRowsRendered }) => {
            const onSectionRendered = ({ rowStartIndex, rowStopIndex }) => {
              onRowsRendered({
                startIndex: rowStartIndex,
                stopIndex: rowStopIndex
              });
            };
            return (
              <AutoSizer onResize={resizeGrid}>
                {({ width, height }) => (
                  <ColumnSizer
                    columnMinWidth={100}
                    columnCount={2}
                    width={width}
                  >
                    {({ adjustedWidth, columnWidth, registerChild }) => {
                      totalWidth = adjustedWidth - scrollbarSize()
                      return (
                        <ScrollSync>
                          {({
                            clientHeight,
                            clientWidth,
                            onScroll,
                            scrollHeight,
                            scrollLeft,
                            scrollTop,
                            scrollWidth
                          }) => {
                            // console.log(adjustedWidth,[...Array(columns.length).keys()].map(index=>colWidth[columns[index]['name']]))
                            return (
                              <div className="GridColumn">
                                <div
                                  style={{
                                    backgroundColor: "grey",
                                    color: "black",
                                    height: headerCellcache.getHeight(0, 0),
                                    width: adjustedWidth - scrollbarSize()
                                  }}
                                >
                                  <Grid
                                    ref={registerChild}
                                    className={"HeaderGrid"}
                                    columnWidth={({index})=>getColumnWidth(index,columnWidth)}
                                    overscanColumnCount={0}
                                    columnCount={columns.length}
                                    height={headerCellcache.getHeight(0, 0)}
                                    rowHeight={headerCellcache.rowHeight}
                                    cellRenderer={headercellRenderer}
                                    rowCount={1}
                                    scrollLeft={scrollLeft}
                                    width={adjustedWidth - scrollbarSize()}
                                    deferredMeasurementCache={headerCellcache}
                                  />
                                </div>
                                <div
                                  style={{
                                    backgroundColor: "lightgrey",
                                    color: "black",
                                    height,
                                    width: adjustedWidth
                                  }}
                                >
                                  <Grid
                                    className={"BodyGrid"}
                                    ref={registerChild}
                                    columnWidth={({index})=>getColumnWidth(index,columnWidth)}
                                    columnCount={columns.length}
                                    height={height}
                                    cellRenderer={cellRenderer}
                                    deferredMeasurementCache={bodyCellcache}
                                    rowHeight={bodyCellcache.rowHeight}
                                    rowCount={ROWCOUNT}
                                    onScroll={onScroll}
                                    width={adjustedWidth}
                                    onSectionRendered={onSectionRendered}
                                  />
                                </div>
                              </div>
                            );
                          }}
                        </ScrollSync>
                      );
                    }}
                  </ColumnSizer>
                )}
              </AutoSizer>
            );
          }}
        </InfiniteLoader>
      </div>
    </div>
  );
}

export default VirtualTable;

