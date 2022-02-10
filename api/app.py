from flask import Flask, jsonify
from flask_cors import CORS,cross_origin
from flask import request
import random
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
reallyLongText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. "
rowCount = 10000
colCount = 4
posts = [
    {'index':i,
    'data':{f'col{j+1}':reallyLongText[:random.randint(15,int(len(reallyLongText)/2))] for j in range(colCount)}
    }
    for i in range(rowCount)
]
remoteRowCount = len(posts)
# from pyarrow.parquet import ParquetFile
# import pyarrow as pa
# import pandas as pd

# pf = ParquetFile('ds_0002_5_50') 
# first_ten_rows = next(pf.iter_batches(batch_size = 100)) 
# df = pa.Table.from_batches([first_ten_rows]).to_pandas() 
# # df = pd.read_parquet('ds_0002_5_50',engine='pyarrow')
# # print(df.shape)
# data = df.to_dict('index')
# # data = {}
# print(df.shape)

# data = [{"data":data,"index":i} for i,data in data.items()]
# remoteRowCount = len(data)
@cross_origin
@app.route('/data')
def getListByPage():
    start = int(request.args.get('startIndex'))
    end = int(request.args.get('endIndex'))
    
    return jsonify({
        "totalRowCount":remoteRowCount,
        "data":posts[start:end+1]
        # "data":data
    })
    # return f"Page {1}"




if __name__ == "__main__":
    app.run(debug=True)