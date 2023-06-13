import { FadeLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div className="w-full flex justify-center">
      <FadeLoader 
        height={10}
        width={3} 
        color={'#1E3A8A'} 
        speedMultiplier={1} 
        />
    </div>
    
  )
}
