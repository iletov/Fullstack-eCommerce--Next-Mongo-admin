import { FadeLoader } from "react-spinners";

export default function Spinner() {
  return (
    <FadeLoader 
        height={15}
        width={5} 
        color={'#1E3A8A'} 
        speedMultiplier={1} 
        />
  )
}
