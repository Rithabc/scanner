import { useState, useEffect } from 'react';

import { imageFORMULAScanJS } from './api/scan.jsx';

function App() {
  const [imageFORMULA, setImageFORMULA] = useState(null);
  const [response, setResponse] = useState(null);
  const [connectionid, setConnectionid] = useState('');

  const settings = {
    "colormode": 4,
    "scanside": 2,
    "limit_number_of_sheets": 100,
    "resolution": 200,
    "pagesize": "AUTO",
    "fileformat": 3,
    "double_feed_detection": 1,
    "document_orientation": -1,
    "blank_page_detection_threshold": 10,
    "edge_emphasis": 0,
    "manual_feed_from_flatbed": 0,
    "carrier_sheet": 0,
    "schmprefix": "",
    "schmseparator": 0,
    "schmdatetime": -2,
    "show_error_message": 1,
    "destination": "http://localhost/php/data/",
    "destinationheaders": {
      "Method": "POST"
    },
    "destinationparameters": [],
    "destinationfileparameter": {
      "contenttype": "application/octet-stream",
      "contentdisposition": "form-data; name=\"file\"; filename=\"SCANNED_FILENAME\""
    },
    "pdf_pages_per_file": 0,
    "pdf_ocr": 1,
    "pdf_ocr_language": "engjpn",
    "zone_ocr_settings": [
      {
        "name": "title",
        "language": "jpn",
        "page": 1,
        "start_x": 3.16667,
        "start_y": 1,
        "end_x": 5.45667,
        "end_y": 1.79,
        "unit": "inch"
      },
      {
        "name": "no",
        "language": "eng",
        "page": 1,
        "start_x": 6.43667,
        "start_y": 1.54,
        "end_x": 7.37334,
        "end_y": 1.95667,
        "unit": "inch"
      },
      {
        "name": "company",
        "language": "jpn",
        "page": 1,
        "start_x": 1.24,
        "start_y": 1.97667,
        "end_x": 3.90667,
        "end_y": 2.68667,
        "unit": "inch"
      },
      {
        "name": "total",
        "language": "eng",
        "page": 1,
        "start_x": 5.34033,
        "start_y": 3.42,
        "end_x": 6.66,
        "end_y": 3.82,
        "unit": "inch"
      }
    ]
  }
  const[scanid, setScanid] = useState('');
  const[fileName, setFileName] = useState('');



  useEffect(() => {
    async function onMount() {
      const result = await imageFORMULAScanJS();
      // console.log(response);
      setImageFORMULA(result);



    }
    onMount();

  }, [])

  const getSettings = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const result = await imageFORMULA.getSettings(FQDN,scannerid, connectionid);
      setResponse(JSON.stringify(result, null, 2));
      setSettings(result.value);
      
    }
    catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error)
    }
  }


  const connectScanner = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const connect = await imageFORMULA.connectScanner(FQDN, scannerid);
      setResponse(JSON.stringify(connect, null, 2));
    }
    catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error)
    }
  }

  const [scannerid, setScannerid] = useState('');
  function handleScannerID(e) {
    setScannerid(e.target.value);
  }

  const updateSettings = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const update = await imageFORMULA.updateSettings(FQDN, scannerid, connectionid, settings);
      setResponse(JSON.stringify(update, null, 2));
    }
    catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error)
    }
      
  }


  const scan = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;

      const scan = await imageFORMULA.getScannerList(FQDN);

      setResponse(JSON.stringify(scan, null, 2));


    }
    catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error)
    }
  }

  const disconnectScanner = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const disconnect = await imageFORMULA.disconnectScanner(FQDN, scannerid, connectionid);
      setResponse(JSON.stringify(disconnect, null, 2));
    }
    catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error)
    }
  }

  const startScan = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const scan = await imageFORMULA.startScan(FQDN, scannerid, connectionid);
      setResponse(JSON.stringify(scan, null, 2));
    }
    catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error)
    }
  }

  const getFileList = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const fileList = await imageFORMULA.getFileList(FQDN, scannerid, connectionid, scanid);
      setResponse(JSON.stringify(fileList, null, 2));
    }
    catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error)
    }
  }

  const clearResponse = () => {
    setResponse(null);
  }

  return (
    <div className='flex gap-2'>


      <div className='p-2 flex gap-2 flex-col'>
        <button onClick={scan} className="btn btn-primary max-w-[100px] shadow-lg">Scanner List</button>
        <button onClick={connectScanner} className="btn btn-primary max-w-[100px]">Connect</button>
        <button onClick={getSettings} className="btn btn-primary max-w-[100px]">getSettings</button>
        <button onClick={updateSettings} className="btn btn-primary max-w-[100px]">updateSettings</button>
        <button onClick={startScan} className="btn btn-primary max-w-[100px]">startScan</button>
        <button onClick={getFileList} className="btn btn-primary max-w-[100px]">getFileList</button>


        <button onClick={disconnectScanner} className="btn bg-red-400 max-w-[100px]">disconnectScanner</button>

      </div>
      <div className='p-2'>
        <div className='bg-primary w-[250px] rounded-t-lg flex justify-between p-2'>
          <h1 className='text-white   rounded-t-lg p-1'>Response</h1>
          <button onClick={clearResponse} className='btn btn-sm'>Clear</button>
        </div>


        <div className='border border-primary w-[250px] h-[90%] text-xs rounded-b-lg p-1 overflow-auto bg-white'>
          {response ? <pre>{response}</pre> : "No response yet"}
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <h1>Scanner ID</h1>
        <input type='text' onChange={handleScannerID} className='w-[200px] h-10 border-2 p-2 rounded-[5px] border-black'></input>

        <h1>Connection ID</h1>
        <input type='text' onChange={(e) => setConnectionid(e.target.value)} className='w-[200px] h-10 border-2 p-2 rounded-[5px] border-black'></input>
        <h1>Scan ID</h1>
        <input type='text' onChange={(e) => setScanid(e.target.value)} className='w-[200px] h-10 border-2 p-2 rounded-[5px] border-black'></input>
        <h1>File name</h1>
        <input type='text' onChange={(e) => setFileName(e.target.value)} className='w-[200px] h-10 border-2 p-2 rounded-[5px] border-black'></input>
      </div>
      <img src={`file:///C:/xampp/htdocs/PHP/data/${fileName}.jpg`} alt="scanned image" />
    </div>
  )
}

export default App;
