import { useSelector } from "react-redux"
import { callSettingReducer } from "../../../features/callSettings"

export default function CallUI({ peerObject, peerAudio}){
    const callSettings = useSelector((state) => state.callSettingReducer)
    const userSettings = useSelector((state) => state.callSettingReducer.userSettings)
    const peerSettings = useSelector((state) => state.callSettingReducer.peerSettings)
    const USER_DATA = useSelector((state) => state.chatReducer.value.USER_DATA)

    return(
        <div className="caller-ui call">
            <div className="volume-meter-wrapper">
                <figure className={userSettings.isMuted ? "muted" : null}>
                    {
                        userSettings.isMuted &&
                        <i className="material-icons">mic_off</i>
                    }
                    <img src={ USER_DATA.profile_picture ? USER_DATA.profile_picture : "https://codenoury.se/assets/generic-profile-picture.png" }/>
                </figure>
                <div className="volume-meter" data-value=""></div>
                {
                    !peerSettings.peerObject &&
                    <span style={{position: "absolute", bottom: "-40px"}}>Ringing...</span>
                }
            </div>
            {
                peerSettings.peerObject &&
                <div className="volume-meter-wrapper">
                    <figure className={peerSettings.isMuted ? "muted" : null}>
                        {
                            peerSettings.isMuted &&
                            <i className="material-icons">mic_off</i>
                        }
                        <img src={ peerSettings.peerObject.profile_picture ? peerSettings.peerObject.profile_picture : "https://codenoury.se/assets/generic-profile-picture.png" }/>
                    </figure>
                    <div className="volume-meter" data-value=""></div>
                </div>
            }
            <div className="audio-block">
                <audio 
                    className="peer-audio" 
                    ref={peerAudio} 
                    autoPlay 
                    muted={peerSettings.isMuted ? true : false}
                ></audio>
            </div>
        </div>
    )
}