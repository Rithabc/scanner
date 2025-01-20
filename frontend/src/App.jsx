import { useState, useEffect } from 'react';

import { imageFORMULAScanJS } from './api/scan.jsx';

function App() {
  const [imageFORMULA, setImageFORMULA] = useState(null);
  const [response, setResponse] = useState(null);
  const [connectionid,setConnectionid] = useState('');

  useEffect(() => {
    async function onMount() {
      const result = await imageFORMULAScanJS();
      // console.log(response);
      setImageFORMULA(result);



    }
    onMount();

  }, [])

  const startScan = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const result = await imageFORMULA.startScan(FQDN,scannerid,connectionid);
      setResponse(JSON.stringify(result,null,2));
    }
    catch (error) {
      setResponse(JSON.stringify(error,null,2));
      console
  }
}


  const connectScanner = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
      const connect = await imageFORMULA.connectScanner(FQDN,scannerid);
      setResponse(JSON.stringify(connect,null,2));
    }
    catch (error) {
      setResponse(JSON.stringify(error,null,2));
      console.error(error)
    }
  }

  const[scannerid,setScannerid] = useState('');
  function handleScannerID(e){
    setScannerid(e.target.value);
  } 

  const scan = async () => {
    try {
      const FQDN = imageFORMULA.DEFAULT.FQDN;
     
      const scan = await imageFORMULA.getScannerList(FQDN);
    
      setResponse(JSON.stringify(scan,null,2));
  

    }
    catch (error) {
      setResponse(JSON.stringify(error,null,2));
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
        <button onClick={startScan} className="btn btn-primary max-w-[100px]">start scan</button>
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
      <input type='text' onChange={handleScannerID} className='w-[200px] h-10 bg-red-400'></input>
      {scannerid}
      <input type='text' onChange={(e) => setConnectionid(e.target.value)} className='w-[200px] h-10 bg-red-400'></input>
      {connectionid}
    </div>
  )
}

export default App;
