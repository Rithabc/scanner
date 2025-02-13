import { useState, useEffect } from "react";

import { imageFORMULAScanJS } from "./api/scan.jsx";

function App() {
  const [imageFORMULA, setImageFORMULA] = useState(null);
  const [response, setResponse] = useState(null);
  const [scannerid, setScannerid] = useState("");
  const [connectionid, setConnectionid] = useState("");
  const [text, setText] = useState([]);

  

  const settings = {
    colormode: 4,
    scanside: 1,
    limit_number_of_sheets: 100,
    resolution: 200,
    pagesize: "AUTO",
    fileformat: 3,
    double_feed_detection: 1,
    document_orientation: -1,
    blank_page_detection_threshold: 10,
    edge_emphasis: 0,
    manual_feed_from_flatbed: 0,
    carrier_sheet: 0,
    schmprefix: "",
    schmseparator: 0,
    schmdatetime: -2,
    show_error_message: 1,
    destination: "https://34.47.233.91/api:5000/upload/007",
    destinationheaders: {
      Method: "POST",
    },
    destinationparameters: [],
    destinationfileparameter: {
      contenttype: "application/octet-stream",
      contentdisposition: 'form-data; name="file"; filename="SCANNED_FILENAME"',
    },
    pdf_pages_per_file: 0,
    pdf_ocr: 1,
    pdf_ocr_language: "eng",
    zone_ocr_settings: [
      {
        name: "micr",
        language: "eng",
        // "font":"E13B",
        page: 1,
        // "start_x": 6.43667,
        start_y: 900,
        // "end_x": 7.37334,
        // "end_y": ,
        unit: "pixel",
      },
    ],
  };
  const [scanid, setScanid] = useState("");
  const [fileNames, setFileNames] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function onMount() {
      const result = await imageFORMULAScanJS();
      // console.log(response);
      setImageFORMULA(result);
    }
    onMount();
  }, []);

  const getSettings = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const result = await imageFORMULA.getSettings(
        FQDN,
        scannerid,
        connectionid
      );
      setResponse(JSON.stringify(result, null, 2));
      setSettings(result.value);
    } catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error);
    }
  };

  const connectScanner = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const connect = await imageFORMULA.connectScanner(FQDN, scannerid);
      setResponse(JSON.stringify(connect, null, 2));
    } catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error);
    }
  };

  function handleScannerID(e) {
    setScannerid(e.target.value);
  }

  const updateSettings = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const update = await imageFORMULA.updateSettings(
        FQDN,
        scannerid,
        connectionid,
        settings
      );
      setResponse(JSON.stringify(update, null, 2));
    } catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error);
    }
  };

  const getScannerList = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;

      const scan = await imageFORMULA.getScannerList(FQDN);

      setResponse(JSON.stringify(scan, null, 2));
    } catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error);
    }
  };

  const disconnectScanner = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const disconnect = await imageFORMULA.disconnectScanner(
        FQDN,
        scannerid,
        connectionid
      );
      setResponse(JSON.stringify(disconnect, null, 2));
    } catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error);
    }
  };

  const startScan = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const scan = await imageFORMULA.startScan(FQDN, scannerid, connectionid);
      setResponse(JSON.stringify(scan, null, 2));
    } catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error);
    }
  };

  const getFileList = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const fileList = await imageFORMULA.getFileList(
        FQDN,
        scannerid,
        connectionid,
        scanid
      );
      setResponse(JSON.stringify(fileList, null, 2));
      setFileName(fileList.value.files[0].filename);
    } catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error);
    }
  };

  const scanSetParams = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const scanResponse = await imageFORMULA.scanSetParameter(settings, FQDN);
      setResponse(JSON.stringify(scanResponse, null, 2));
      setFileNames(scanResponse.value.files);
      const result = await fetch(
        `https://34.47.233.91/api:5000/ocrData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filenames: scanResponse.value.files }),
        }
      );
      const data = await result.json();
      setText(data.result);
      const jpg = await fetch(
        `https://34.47.233.91/api:5000/toJpg`
      ,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({filenames: scanResponse.value.files}),
      });
    } catch (error) {
      setResponse(JSON.stringify(error, null, 2));
      console.error(error);
    }
  };

  const clearResponse = () => {
    setResponse(null);
  };

  return (
    <div className="w-[90%]">
      <div className="flex gap-2 mb-2">
        <div className="p-2 flex gap-2 flex-col">
          <button
            onClick={getScannerList}
            className="btn btn-primary max-w-[100px] shadow-lg"
          >
            Scanner List
          </button>
          <button
            onClick={connectScanner}
            className="btn btn-primary max-w-[100px]"
          >
            Connect
          </button>
          <button
            onClick={getSettings}
            className="btn btn-primary max-w-[100px]"
          >
            getSettings
          </button>
          <button
            onClick={updateSettings}
            className="btn btn-primary max-w-[100px]"
          >
            updateSettings
          </button>
          <button onClick={startScan} className="btn btn-primary max-w-[100px]">
            startScan
          </button>
          <button
            onClick={getFileList}
            className="btn btn-primary max-w-[100px]"
          >
            getFileList
          </button>
          <button
            onClick={scanSetParams}
            className="btn btn-primary max-w-[100px]"
          >
            Scan
          </button>

          <button
            onClick={disconnectScanner}
            className="btn bg-red-400 max-w-[100px]"
          >
            disconnectScanner
          </button>
        </div>
        <div className="p-2">
          <div className="bg-primary w-[250px] rounded-t-lg flex justify-between p-2">
            <h1 className="text-white   rounded-t-lg p-1">Response</h1>
            <button onClick={clearResponse} className="btn btn-sm">
              Clear
            </button>
          </div>

          <div className="border border-primary w-[250px] h-[400px] text-xs rounded-b-lg p-1 overflow-auto bg-white">
            {response ? <pre>{response}</pre> : "No response yet"}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1>Scanner ID</h1>
          <input
            type="text"
            onChange={handleScannerID}
            className="w-[200px] h-10 border-2 p-2 rounded-[5px] border-black"
          ></input>

          <h1>Connection ID</h1>
          <input
            type="text"
            onChange={(e) => setConnectionid(e.target.value)}
            className="w-[200px] h-10 border-2 p-2 rounded-[5px] border-black"
          ></input>
          <h1>Scan ID</h1>
          <input
            type="text"
            onChange={(e) => setScanid(e.target.value)}
            className="w-[200px] h-10 border-2 p-2 rounded-[5px] border-black"
          ></input>
          <h1>File name</h1>
          <input
            type="text"
            onChange={(e) => setFileName(e.target.value)}
            className="w-[200px] h-10 border-2 p-2 rounded-[5px] border-black"
          ></input>
        </div>

      
          <div key={"normal images"}>
            {fileNames?.map((file, index) => {
              return (
                
                  <img
                    key={index+1}
                    src={`https://34.47.233.91/api:5000/images/${file.filename.replace(
                      ".tif",
                      ".jpg"
                    )}`}
                    className="w-[750px] h-[300px]"
                  ></img>

                
              );
            })}
          </div>
          {/* <div key={"B&W images"}>
            {fileNames?.map((file, index) => {
              return (
                <>
                 
                  <img key={index} src={`https://34.47.233.91/api:5000/B&Wimages/${file.filename.replace(".tif",".jpg"
                    )}`}
                    className="w-[750px] h-[300px]"
                  ></img>
                </>
              );
            })}
          </div> */}
        

      
      </div>
      
    </div>
  );
}

export default App;
