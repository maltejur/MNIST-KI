from flask import Flask,request,send_from_directory
import json
import time
import base64
from PIL import Image
from io import BytesIO
import os

app = Flask(__name__)

from PIL import Image
import numpy as np
from tensorflow_core.keras.models import load_model

model = load_model("model.h5")

@app.route('/server',methods=['POST'])
def sendResponse():
    b = request.json["im"][22:]
    i = Image.open(BytesIO(base64.b64decode(b))).convert("L")
    im = np.array(i)
    im = im[np.newaxis,...,np.newaxis]

    im = im.astype('float32')
    im /= 255
    t = time.time()
    p = model.predict(im)
    p = p.astype("float")
    return(json.dumps([list(p[0]),time.time()-t]))

@app.route("/")
def index():
    return send_from_directory('.', "index.html")

@app.route("/<path:path>")
def sendFile(path):
    return send_from_directory('.', path)

app.run(debug=False, host='localhost',threaded=False)