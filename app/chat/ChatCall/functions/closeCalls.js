import store from "../../../features/store";
import callMessage from "../../ChatBottom/functions/callMessage";
import { chatReducer } from "../../../features/chat";
import { callSettingReducer, callSettingsReset } from "../../../features/callSettings";

export function callTerminated(socket){
    const state         =   store.getState().chatReducer.value
    const callSettings  =   store.getState().callSettingReducer
    const userSettings  =   callSettingReducer.userSettings
    const USER_DATA     =   state.USER_DATA

    
    if(userSettings.userStream){
        userSettings.userStream.getTracks().forEach(function(track) {
            track.stop();
        });
    }

    socket.emit('call-closed', {
        id: callSettings.id,
        user_id: USER_DATA.account_id,
        name: `${USER_DATA.firstname} ${USER_DATA.lastname}`,
        room: callSettings.members.map(e => e.id).filter(e => e !== USER_DATA.account_id)
    })

    // Cleaning function, removes stream, castStream and destroys peer
    try {
        document.querySelectorAll('.call-window video').forEach((video) => {
            
            var tracks = video.srcObject.getTracks();
            tracks.forEach((track) => {
                
                track.stop()
            })
            video.srcObject = null;
        })
    } catch(err){
        
    }

    try {
        userSettings.userPeer.destroy()
    } catch(err){
        
    }

    store.dispatch(callSettingsReset())
}

export function callInterrupt(err, socket){
    const state         =   store.getState().chatReducer.value
    const callSettings  =   store.getState().callSettingReducer
    const userSettings  =   callSettingReducer.userSettings
    const USER_DATA     =   state.USER_DATA

    
    if(callSettings.initiator){
        callMessage(socket)
    }
    
    if(callSettings.members.length > 1){
        socket.emit('call-error', {
            userID: USER_DATA.account_id,
            message: err,
            room: callSettings.members.map(e => e.id).filter(e => e !== USER_DATA.account_id)
        })
    }

    // Cleaning function, removes stream, castStream and destroys peer
    try {
        document.querySelectorAll('.call-window video').forEach((video) => {
            
            var tracks = video.srcObject.getTracks();
            tracks.forEach((track) => {
                
                track.stop()
            })
            video.srcObject = null;
        })
    } catch(err){
        
    }

    try {
        userSettings.userPeer.destroy()
    } catch(err){
        
    }

    store.dispatch(callSettingsReset())
}