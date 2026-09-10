import { ThreeDot } from "react-loading-indicators";
import "./LoadingPage.css";

const LoadingPage = () => {

  return (
    <div className="LoadingPage">
        <ThreeDot
            className="loading-indicator" 
            color="#3294cd" 
            size="medium" 
            text="" 
            textColor="" 
        />
    </div>
  );
}

export default LoadingPage


