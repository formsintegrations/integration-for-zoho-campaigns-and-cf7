import { action, trigger } from "../Config"
import GetLogo from "../Utils/GetLogo"
import ShakleIcon from "./ShakleIcon"

export default function WelcomeBanner() {
  const style = {
    root: {
      width: "100%",
      height: "400px",
      padding: "45px 45px 10px 45px"
    },
    gradient: {
      background: "linear-gradient(90deg, rgba(156,59,218,1) 0%, rgba(92,20,154,1) 35%, rgba(20,44,154,1) 100%)",
      backgroundColor: "rgb(156, 59, 218)",
      height: "100%",
      minWidth: "60%",
      maxWidth: "680px",
      color: "white",
      fontSize: "100px",
      borderRadius: "15px"
    },
    img: {
      maxWidth: "160px",
      maxHeight: "160px",
      margin: 0
    }
  }
  return (
    <div style={style.root} className="flx flx-center">
      <div style={style.gradient} className="flx flx-center">
        <GetLogo name={trigger} style={style.img} />
        <ShakleIcon size={"100px"} />
        <GetLogo name={action} style={style.img} />
      </div>
    </div>
  )
}
