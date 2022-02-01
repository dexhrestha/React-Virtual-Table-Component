return  ( 
    <ScrollSync>
  {({
    clientHeight,
    clientWidth,
    onScroll,
    scrollHeight,
    scrollLeft,
    scrollTop,
    scrollWidth,
  }) => (
        <InfiniteLoader
    isRowLoaded={isRowLoaded}
    loadMoreRows={loadMoreRows}
    rowCount={remoteRowCount}
    minimumBatchSize={10}
    threshold={10}
    >
        {({onRowsRendered,registerChild})=>{
        <div  className={styles.GridColumn}>
            <AutoSizer>
           {({height,width}) => (
               <ColumnSizer
                 columnMaxWidth={500}
                 columnMinWidth={100}
                 columnCount={2}
                 key="GridColumnSizer"
                 width={width}>
                 {({adjustedWidth, columnWidth, registerChild}) => {
                       return <div>
                          <div>
                          <Grid 
                            className={styles.HeaderGrid}
                            cellRenderer={headerCellRenderer}
                            columnCount={columns.length}
                            columnWidth={100}
                            height={80}
                            rowCount={1}
                            rowHeight={80}
                            width={500}
                        />
                          </div>
                          <div
                          style={{
                            height: 755,
                            width: 500,
                          }}>
                         
                          <Grid

                            className={styles.BodyGrid}
                            ref={registerChild}
                            columnWidth={120}
                            columnCount={columns.length}
                            height={755}
                            noContentRenderer={()=><div>No cells</div>}
                            cellRenderer={cellRenderer}
                            rowHeight={50}
                            rowCount={remoteRowCount}
                            width={500}
                          />
                    
                        </div>                                     
                          
                      </div>
           
                        
                }}
               </ColumnSizer>
             )}
            </AutoSizer> 
        </div>
        }}
    </InfiniteLoader>

    
    )}
    </ScrollSync>
);