import React, { useState } from 'react';
import { Button, ButtonProps } from '../ui/button';
import { Minimize2, Maximize2 } from 'lucide-react';

const ButtonFullScreen = (props: React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps) => {
    const [fullscreen, setFullscreen] = useState(false);

    const handleFullscreen = () => {
        const doc = document as Document & {
            mozFullScreenElement?: Element;
            webkitFullscreenElement?: Element;
            msFullscreenElement?: Element;
            mozCancelFullScreen?: () => void;
            webkitCancelFullScreen?: () => void;
            msExitFullscreen?: () => void;
        };

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
                // @ts-ignore
            } else if (elem.mozRequestFullScreen) {
                // @ts-ignore
                elem.mozRequestFullScreen();
                // @ts-ignore
            } else if (elem.webkitRequestFullscreen) {
                // @ts-ignore
                elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                // @ts-ignore
            } else if (elem.msRequestFullscreen) {
                // @ts-ignore
                elem.msRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
            setFullscreen(prev => !prev);
        } else {
            if (doc.exitFullscreen) {
                doc.exitFullscreen();
            } else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            } else if (doc.webkitCancelFullScreen) {
                doc.webkitCancelFullScreen();
            } else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
            }
            setFullscreen(prev => !prev);
        }
    };

    return (
        <Button {...props} onClick={handleFullscreen}>
            {fullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </Button>
    );
}

export default ButtonFullScreen;