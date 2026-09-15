import { useState, useEffect } from 'react'
import HomePage from './components/HomePage/HomePage'
import GraphPage from "./components/GraphsPage/GraphsPage";
import LodingPage from "./components/LoadingPage/LoadingPage";
import * as XLSX from "xlsx";
import './App.css'

const App = () => {
    const [file, setFile] = useState([]);
    const [fileName, setFileName] = useState([]);
    const [data, setData] = useState([]);
    // const [fullData, setFullData] = useState([]);
    const [isShown, setIsShown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isHomePage, setIsHomePage] = useState(true);

    const [longitudeArray, setLongitudeArray] = useState([]);
    const [latitudeArray, setLatitudeArray] = useState([]);

    const [dataTime, setDataTime] = useState([]);
    const [cords, setCords] = useState([]);

    const [crossData, setCrossData] = useState([]);
    const [closeCircles, setCloseCircles] = useState([]);
    const [fullEight, setFullEight] = useState([]);
    
    const [minRow, setMinRow] = useState(0);
    // const [minRow, setMinRow] = useState(110000);
    // const [maxRow, setMaxRow] = useState(125000);
    const [maxRow, setMaxRow] = useState(2720119);

    const [minX, setMinX] = useState(0.99999835);
    const [maxX, setMaxX] = useState(1.00000164);
    const [minY, setMinY] = useState(0.99999811);
    const [maxY, setMaxY] = useState(1.00000188);

    // const [minRow, setMinRow] = useState(110000);
    // const [maxRow, setMaxRow] = useState(116100);
    const targetPoint = [0.60286,  0.54773];
    const targetPointRange = [[targetPoint[0]*0.99991, targetPoint[0]*1.00009], [targetPoint[1]*0.99990, targetPoint[1]*1.00011]];

    // useEffect(() => {
      
    //     createStatistics();
    //     cordMatrix();
    //     console.log(dataTime)
    //     setTimeout(() => {
    //         setIsLoading(false);
    //         setIsShown(true);
    //     }, 2000);
    //     setIsLoading(true);
    //     setIsShown(false);
    // }, [minRow]);
    
    const createStatistics = () => {
      if (data.length > 0) {
        console.log(data)
        console.log(data[0])
        const longArr = [];
        const latArr = [];
        const longIndex = data[0].indexOf("FFS1_Ownship.LHD_ESL_Flight_Model_Data.LHD_ESL_Flight_Model_Data.Longitude");
        const latIndex = data[0].indexOf("FFS1_Ownship.LHD_ESL_Flight_Model_Data.LHD_ESL_Flight_Model_Data.Latitude");

        data.map((item, index) => {
          longArr.push(item[longIndex]);
          latArr.push(item[latIndex]);
        })
        const longArrSpliced = longArr.slice(minRow, maxRow)
        const latArrSpliced = latArr.slice(minRow, maxRow)

        const longArrFiltered = longArrSpliced.filter((cord) => cord !== " " && typeof cord !== "string")
        const latArrFiltered = latArrSpliced.filter((cord) => cord !== " " && typeof cord !== "string")


        console.log(longArrFiltered)
        console.log(latArrFiltered)
        setLongitudeArray(longArrFiltered);
        setLatitudeArray(latArrFiltered);
      }
    };

    const cordMatrix = () => {
        const cordcord = [];
        latitudeArray.map((item, index) => {
            cordcord.push([longitudeArray[index], latitudeArray[index]]);
        })
        setCords(cordcord)

        const objArr = createData();
        console.log(objArr)
        setDataTime(objArr)
    };


    const createData = () => {
        const objArr = [];
        console.log(cords)
        for (let i = 0; i < cords.length; i++) {
           const obj = {x: cords[i][0], y: cords[i][1], id: i+1}
           objArr.push(obj);
        }

        return objArr;
    };

    const handleClick = () => {
        createStatistics();
        cordMatrix();
        console.log(dataTime)
        setTimeout(() => {
            setIsLoading(false);
            setIsShown(true);
            crossLinks();
        }, 2000);
        setIsLoading(true);
        setIsShown(false);
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const data = await file.arrayBuffer();
        setFile(data);
        const workbook = XLSX.readFile(data);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 , defval: ""});
        
        setFileName(file.name);
        setData(jsonData);
    };

    const eight =  () => {
      setMinRow(207000);
      setMaxRow(250850);
      console.log(8)
      crossLinks()
    };

    const fullTest =  () => {
      setMinRow(0);
      setMaxRow(data.length);
      console.log(100)
      // crossLinks()
    };

    const isIncludes = (crosses, cord) => {
        let isContains = false;
        crosses.map((elem) => {if (elem.x === cord[0] && elem.y === cord[1]) {
            isContains = true;
          }}
        );
        return isContains; 
    };

    const isIncludesObj = (crosses, cord) => {
        let isContains = false;
        crosses.map((elem) => {if (elem.x === cord.x && elem.y === cord.y) {
            isContains = true;
          }}
        );
        return isContains; 
    };

      const checkIfInRange = (cord) => {
        if (cord[0] > targetPointRange[0][0] && cord[0] < targetPointRange[0][1] && cord[1] > targetPointRange[1][0] && cord[1] < targetPointRange[1][1]) {
          return true;
        } else {
          return false;
        }
      }

    const crossLinks = () => {
      const crosses = [];
      const time = [];
      console.log(cords)
      cords.map((cord, index) => {
        if (index+5000 < cords.length) {
          for (let i = index+100; i < index+5000; i++) {
            if ((cord[0]*minX < cords[i][0] && cord[0]*maxX > cords[i][0]) && (cord[1]*minY < cords[i][1] && cord[1]*maxY > cords[i][1]) && (cord[0] !== cords[i][0] || cord[1] !== cords[i][1])) {
              if (!isIncludes(crosses, cord) && checkIfInRange(cord) && !time.includes(i)) {
                crosses.push({x: cord[0], y: cord[1], id: index*10000000});
                time.push({time: i, cord: {x: cord[0], y: cord[1], id: index*10000000}});
              }
            }
          }
        }
      })
      console.log(crosses);
      console.log(time);
      setCrossData(crosses);
      checkIfTwoCircles(time);
    }        

    const checkIfTwoCircles = (time) => {
      const maxTimeDelta = 110000;
      const circlrDelta = 2450;
      const cordTime = [];
      const closeByCords = [];
      const eightCords = [];
      time.map((obj, index) => {
        if (index+1 < time.length) {
          for (let i = index+1; i < time.length; i++) {
            if (obj.time - time[i].time < maxTimeDelta && obj.time - time[i].time > 0 && (!isIncludesObj(closeByCords, obj.cord))) {
                closeByCords.push({x: obj.cord.x, y: obj.cord.y, id: obj.cord.id});
                cordTime.push(obj.time);
                console.log(obj.time)
            }
          }
        }
      })
      const max = Math.max(...cordTime);
      const min = Math.min(...cordTime);
      console.log(max)
      console.log(min)

      for (let i = min - circlrDelta ; i < min ; i++) {
        eightCords.push({x: cords[i][0], y: cords[i][1], id: i*100000000000000000000000});
      }
      for (let i = max - circlrDelta ; i < max; i++) {
        eightCords.push({x: cords[i][0], y: cords[i][1], id: i*10000000000000000});
      }

      console.log(closeByCords)
      setCloseCircles(closeByCords);
      setFullEight(eightCords);
    }


  return (
    <div className="App">
      {isHomePage && isShown ?
      <>
        <HomePage 
          handleClick={handleClick}
          handleFileUpload={handleFileUpload}
          fileName={fileName}
          eight={eight}
          fullTest={fullTest}
        />
        <GraphPage 
          mainData={dataTime}
          crossData={crossData}
          closeCircles={closeCircles}
          fullEight={fullEight}
          targetPoint={targetPoint}
        />
      </> : isHomePage && isLoading ?
      <>
        <HomePage 
          handleClick={handleClick}
          handleFileUpload={handleFileUpload}
          fileName={fileName}
          eight={eight}
          fullTest={fullTest}
        />
        <LodingPage /> 
      </> :
      <HomePage 
          handleClick={handleClick}
          handleFileUpload={handleFileUpload}
          fileName={fileName}
          eight={eight}
          fullTest={fullTest}
        />
      
      }
    </div>
  )
}

export default App