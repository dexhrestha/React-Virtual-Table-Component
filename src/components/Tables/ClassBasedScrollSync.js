import React from "react";
import {CellMeasurerCache,CellMeasurer,InfiniteLoader,AutoSizer,List} from 'react-virtualized';
import DivElement from '../Item/Custom';
import axios from "axios";
import styles from '../../source/CellMeasurer/CellMeasurer.DynamicHeightGrid.example.css'
const API_URL = "http://localhost:5000"

class DynamicHeightList extends React.Component {

  constructor(props, context) {
    super(props, context);

    this._cache = new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 50,
    });

    this._rowRenderer = this._rowRenderer.bind(this);
  }

  render() {
    const {width} = this.props;

    return (
      <List
        className={styles.BodyGrid}
        deferredMeasurementCache={this._cache}
        height={400}
        overscanRowCount={0}
        rowCount={1000}
        rowHeight={this._cache.rowHeight}
        rowRenderer={this._rowRenderer}
        width={width}
      />
    );
  }

  _rowRenderer({index, key, parent, style}) {
    const {getClassName, list} = this.props;

    const datum = list.get(index % list.size);
    const classNames = getClassName({columnIndex: 0, rowIndex: index});

    const imageWidth = 300;
    const imageHeight = datum.size * (1 + (index % 3));

    const source = `https://www.fillmurray.com/${imageWidth}/${imageHeight}`;

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}>
        {({measure, registerChild}) => (
          <div ref={registerChild} className={classNames} style={style}>
            <img
              onLoad={measure}
              src={source}
              style={{
                width: imageWidth,
              }}
            />
          </div>
        )}
      </CellMeasurer>
    );
  }
}

export default DynamicHeightList;s