import React, { useRef, useState } from 'react';
import { Button } from './button';
import { ExpandIcon, Maximize, Maximize2, Minimize2 } from 'lucide-react';


const ButtonFullScreen = (props) => {
    const [fullscreen, setFullscreen] = useState(false)

    const handleFullscreen = () => {

        if (!document.fullscreenElement &&
            !document.mozFullScreenElement && // Mozilla
            !document.webkitFullscreenElement && // Webkit-Browser
            !document.msFullscreenElement) { // MS IE ab version 11
    
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            setFullscreen(prev=>!prev)

        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            setFullscreen(prev=>!prev)
        }
        
        
    };

      return (
        <Button {...props} onClick={handleFullscreen}>{fullscreen ? <Minimize2 size={20}/> : <Maximize2 size={20}/>}</Button>
      );
}
 
export default ButtonFullScreen;
