import React from 'react'
import { useState,useEffect } from 'react';
import { imageFORMULAScanJS } from "../api/scan.jsx";


function codeIsValid(code){
    if(code.length != 3){
        return false;
    }
    for(let i = 0; i<code.length;i++){
      if(code[i] < '0' || code[i] > '9'){
        return false;
    }
  }
  return true;
}



export default function Scanner() {
    const[chequeCount,setChequeCount] = useState(0);
    // const cheques = ["001_00001","001_00002","001_00003","001_00004","001_00005","001_00006","001_00007","001_00008","001_00009","001_00010","001_00011","001_00012","001_00013","001_00014","001_00015","001_00016","001_00017","001_00018","001_00019","001_00020","001_00021","001_00022","001_00023","001_00024","001_00025","001_00026","001_00027","001_00028","001_00029","001_00030","001_00031","001_00032","001_00033","001_00034","001_00035","001_00036","001_00037","001_00038","001_00039","001_00040","001_00041","001_00042","001_00043","001_00044","001_00045","001_00046","001_00047","001_00048","001_00049","001_00050","001_00051","001_00052","001_00053","001_00054","001_00055","001_00056","001_00057","001_00058","001_00059","001_00060","001_00061","001_00062","001_00063","001_00064","001_00065","001_00066","001_00067","001_00068","001_00069","001_00070","001_00071","001_00072","001_00073","001_00074","001_00075","001_00076","001_00077","001_00078","001_00079","001_00080","001_00081","001_00082","001_00083","001_00084","001_00085","001_00086","001_00087","001_00088","001_00089","001_00090","001_00091","001_00092","001_00093","001_00094","001_00095","001_00096","001_00097","001_00098","001_00099","001_00100","001_00101"] 
    const[branchCode,setBranchCode] = useState('');
    const[files,setFiles] = useState([]);
    const[cheques,setCheques] = useState([]);
    const[response,setResponse] = useState('');
    const[fileNames,setFileNames] = useState([]);

    const[image,setImage] = useState(null);
    useEffect(()=>{
        setImage(imageFORMULAScanJS());
    },[])






    const startScan =async (code)=>{
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
    destination: `http://localhost:5000/upload/${code}`,
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
}
        try {
            const FQDN = image.DEFAULT.FQDN;
            const scanResponse = await image.scanSetParameter(settings, FQDN);
            // const data = await scanResponse.json();
            console.log(scanResponse);
            setResponse(JSON.stringify(scanResponse, null, 2));
            setFileNames(scanResponse.value.files);
            console.log(fileNames);
    }
    
    catch (error) {
        setResponse(JSON.stringify(error, null, 2));
        console.error(error);
    }
  }

    



  return (
    <div className='bg-blue-100 w-full h-screen flex justify-center items-center'>
      <div className='w-[80%] h-[60%] bg-gray-300 flex justify-center items-center rounded-lg gap-2 pt-2 px-2'>
        <div className='bg-red-200 h-[90%] w-[60%]'>
            <div className='w-[100%] h-[100%] flex justify-center flex-col items-center gap-2 overflow-y-scroll'>
            {
              fileNames?.map((cheque,index)=>(
                <img src={`http://localhost:5000/tiff/${branchCode}_${cheque.filename}`} alt="cheque" className='w-[80%] h-[40%]' key={index}/>               
              )
            )}
            </div>
        </div>
        <div className='bg-red-200 h-[90%] w-[25%] overflow-y-scroll  '>
            {fileNames?.map((cheque,index)=>(
                <div key={index} className='bg-green-100 w-[100%] h-[10%] flex justify-between items-center p-2 gap-2'>
                    <h1 className='text-1xl font-bold'>{branchCode}_{cheque.filename}</h1>
                    
                </div>
            ))}
        </div>
        <div className=' h-[90%] w-[25%] flex flex-col justify-center items-center gap-2'>
            <div className='bg-green-100 w-[100%] h-[50%] flex flex-col gap-2 justify-center items-center rounded-sm'>
                <input type="text" onChange={(e)=>{setBranchCode(e.target.value)}} placeholder='Branch Code' className='w-[90%] focus:none input'/>
                <div className='flex gap-2 justify-center items-center w-[100%]'>
                    <button className='btn w-[42%] '>Connect</button>
                    <button className='btn w-[42%] '>End Batch</button>
                </div>
                <div className='flex gap-2 justify-center items-center w-[100%]'>
                    <button className={`btn w-[42%]  ${codeIsValid(branchCode)?"":'btn-disabled'}`} onClick={()=>startScan(branchCode)}>Scan</button>
                    <button className='btn w-[42%] '>Stop</button>
                </div>
            </div>
            <div className='bg-green-100 w-[100%] h-[50%] flex flex-col justify-between p-1 rounded-sm'>
                <div className='flex gap-2 justify-between p-2 items-center'>
                    <h1 className='text-1xl font-bold'>Cheque Count</h1>
                    <h1 className='text-1xl font-bold'>{chequeCount}</h1>

                </div>
                <div className='flex flex-col gap-2 p-2'>
                    <div className='flex gap-2'>
                        <input type="radio" name="radio-3" className="radio radio-neutral" defaultChecked />
                        <label className='text-1xl font-semibold'>Front image</label>
                    </div>
                    <div className='flex gap-2'>
                        <input type="radio" name="radio-3" className="radio radio-neutral" />
                        <label className='text-1xl font-semibold'>Back image</label>
                    </div>
                </div>
            </div>
        </div>


      </div>
      
    </div>
  )
}
