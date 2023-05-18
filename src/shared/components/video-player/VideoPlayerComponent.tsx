import "./VideoPlayerComponent.scss";
import React from 'react'
import ReactPlayer from 'react-player'
import {ImageConfig} from "../../../constants";
import IconButtonComponent from "../icon-button/IconButtonComponent";

interface VideoPlayerComponentProps {
    url: string;
    onClose?: () => void;
}

const VideoPlayerComponent = (props: VideoPlayerComponentProps) => {

    const {url, onClose} = props;

    return (
        <div className={'video-player-component'}>
            <div className={'video-player-controls'}>
                {onClose && <IconButtonComponent onClick={onClose} color={"inherit"}>
                    <ImageConfig.CloseIcon/>
                </IconButtonComponent>}
            </div>
            <ReactPlayer url={url} playing={true} controls={true}/>
        </div>
    );

};

export default VideoPlayerComponent;
