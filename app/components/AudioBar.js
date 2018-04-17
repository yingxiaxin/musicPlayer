import React from 'react';
import '../styles/audioBar.less';

class AudioBar extends React.Component
{
    constructor(props)
    {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleDragVolume = this.handleDragVolume.bind(this);
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.audioInitialize = this.audioInitialize.bind(this);
        this.audioEnded = this.audioEnded.bind(this);
        this.audioOnPlay = this.audioOnPlay.bind(this);
        this.handleDragProgress = this.handleDragProgress.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);

        //雪碧图中播放暂停图标、循环模式图标、静音图标的位置
        this.playStatusPosArray = ['0 0px', '-30px 0'];
        // this.repeatModePosArray = ['0 -72.5px', '0 -205px', '0 -232px']; //暂时只启用单曲循环功能

        this.repeatModePosArray = ['0 -232px', '0 -232px', '0 -232px'];

        this.muteStatusPosArray = ['0 -144px', '0 -182px'];

        //音量控制条中rgb三个通道的最大小值数组，用来计算渐变
        this.rgbInterval = [[232, 234], [191, 35], [160, 0]];

        this.lastVolume = 0;

        this.repeatModeGen = function* ()
        {
            while(1)
            {
                yield 0;
                yield 1;
                yield 2;
            }
        }

        this.muteGen = function* ()
        {
            while(1)
            {
                yield 0;
                yield 1;
            }
        }

        this.rgen = this.repeatModeGen();
        this.mgen = this.muteGen();
        this.rgen.next();
        this.mgen.next();

        this.audioInfo = {};
        this.audioUrl = 'http://music.163.com/song/media/outer/url?';
    }

    handleClick(e)
    {
        switch(e.target.className)
        {
            case 'prev':
            {
                this.playPrev();
                break;
            }
            case 'play':
            {
                let audio = document.getElementById('audio');
                if(audio.paused == true)
                {
                    this.switchPlayStatus(1);   //1是开始播放，0是暂停
                }
                else
                {
                    this.switchPlayStatus(0);
                }
                break;
            }
            case 'next':
            {
                playNext();
                break;
            }
            case 'repeatMode':
            {
                this.switchRepeatMode(e);
                this.changeMode();
                break;
            }
            case 'mute':
            {
                this.switchMuteMode(e);
                this.changeMute();
                break;
            }
        }
    }

    handleMouseMove(e)
    {
        let domNode = e.currentTarget;
        let x = e.pageX - domNode.offsetLeft;
        let y = e.pageY - domNode.offsetTop;
        domNode.style.setProperty('--x', x + 'px');
        domNode.style.setProperty('--y', y + 'px');
    }
    
    handleTimeUpdate(e)
    {
        let audio = e.target,
            newTime = Math.round(audio.currentTime),
            currentTimeLabel = document.getElementById('currentTime');
        
        currentTimeLabel.innerHTML = this.timeStrTransform(newTime);

        let progress = document.getElementById('progressBar');
        progress.value = newTime;

        let updateLyric = this.props.updateLyricCallback;
        updateLyric(audio.currentTime);
    }

    handleDragProgress(e)
    {
        let progress = e.target,
            audio = document.getElementById('audio');
        audio.currentTime = progress.value;
        let currentTimeLabel = document.getElementById('currentTime');
        currentTimeLabel.innerHTML = this.timeStrTransform(progress.value);

        this.switchPlayStatus(1);   //拖动后直接开始播放
    }

    audioInitialize(e)
    {
        let audio = e.target,
            audioLength = Math.round(audio.duration),
            totalTimeLabel = document.getElementById('totalTime');
        
        totalTimeLabel.innerHTML = this.timeStrTransform(audioLength);

        let progress = document.getElementById('progressBar');
        progress.max = audioLength;
    }

    audioEnded(e)
    {
        this.switchPlayStatus(0);
    }

    audioOnPlay(e)
    {
        this.switchPlayStatus(1);
        console.log('on play');
    }

    timeStrTransform(timestr)
    {
        let minMod = Math.floor(timestr / 60) + "",
            secMod = (timestr - minMod * 60) + "";

        let minStr = minMod.padStart(2, '0'),
            secStr = secMod.padStart(2, '0');

        return minStr + ' : ' + secStr;
    }

    //从音乐列表点击调用的函数，将音乐信息传递过来，并直接开始播放
    playSong(songinfo)
    {
        this.songinfo = songinfo;
        let audio = document.getElementById('audio');
        audio.src = this.audioUrl + 'id=' + this.songinfo.id + '.mp3';
        this.switchPlayStatus(1);
    }

    switchPlayStatus(index)
    {
        let domNode = document.getElementsByClassName('play')[0];
        domNode.style.backgroundPosition = this.playStatusPosArray[index];

        let audio = document.getElementById('audio');
        if(index == 0)
        {
            audio.pause();
        }
        else
        {
            audio.play();
        }
    }

    switchRepeatMode(e)
    {
        let domNode = e.target;
        domNode.style.backgroundPosition = this.repeatModePosArray[this.rgen.next().value];
    }

    switchMuteMode(e)
    {
        let domNode = e.target;
        domNode.style.backgroundPosition = this.muteStatusPosArray[this.mgen.next().value];
    }

    playPrev()
    {

    }

    playNext()
    {

    }

    changeMode()
    {

    }

    changeMute()
    {
        let audio = document.getElementById('audio');
        let volume = document.getElementById('volumeBar');
        
        if(audio.muted)
        {
            let vol = this.lastVolume;
            volume.style.background = this.computeVolumeRGB(vol);
            volume.value = vol;
        }
        else
        {
            this.lastVolume = volume.value;
            volume.style.background = this.computeVolumeRGB(0);
            volume.value = 0;
        }

        audio.muted = !audio.muted;
    }

    handleDragVolume(e)
    {
        let domNode = e.target,
            vol = domNode.value;

        domNode.style.background = this.computeVolumeRGB(vol);

        let audio = document.getElementById('audio');
        audio.volume = (vol / 100);
    }

    computeVolumeRGB(vol)
    {
        let 
            percent = vol / 100,
            rgbGapArray = [(this.rgbInterval[0][1] - this.rgbInterval[0][0]), (this.rgbInterval[1][1] - this.rgbInterval[1][0]), (this.rgbInterval[2][1] - this.rgbInterval[2][0])],
            beginRgb = 'rgba(' + this.rgbInterval[0][0] + ',' + this.rgbInterval[1][0] + ',' + this.rgbInterval[2][0] + ',1)',
            endRgb =  'rgba(' + Math.round(this.rgbInterval[0][0] + rgbGapArray[0] * percent) + ',' + Math.round(this.rgbInterval[1][0] + rgbGapArray[1] * percent) + ',' 
                        + Math.round(this.rgbInterval[2][0] + rgbGapArray[2] * percent) + ',1)';

        let bgcolor = 'linear-gradient(to right, ' + beginRgb + ' 0%, ' +  endRgb + ' ' +  percent*100 + '%, ' + 'rgba(227,221,216,1) ' + (percent*100+1) + '%, ' + 'rgba(227,221,216,1) 100%';
        return bgcolor;
    }

    render()
    {
        return (
            <div className="audioBar" onMouseMove={this.handleMouseMove}>
                <audio src="./city.mp3" id="audio" volumevalue="1" 
                                        onTimeUpdate={this.handleTimeUpdate} 
                                        onCanPlay={this.audioInitialize}
                                        onEnded={this.audioEnded}
                                        onPlay={this.audioOnPlay}
                                        loop>
                </audio>
                <div className="controlBtn">
                    <a href="javascript:void(0)" className="prev" onClick={this.handleClick}></a>
                    <a href="javascript:void(0)" className="play" onClick={this.handleClick}></a>
                    <a href="javascript:void(0)" className="next" onClick={this.handleClick}></a>
                    <a href="javascript:void(0)" className="repeatMode" onClick={this.handleClick}></a>
                </div>
                <div className="progress">
                    <section>
                        <span id="currentTime">--</span>
                        <span> / </span>
                        <span id="totalTime">--</span>
                    </section>
                    
                    <input type="range" name="progressBar" id="progressBar" defaultValue="0" step="1" onChange={this.handleDragProgress}/>
                </div>
                <div className="volume">
                    <a href="javascript:void(0)" className="mute" onClick={this.handleClick}></a>
                    <input type="range" name="volumeBar" id="volumeBar"  min="0" max="100" step="1" defaultValue="100" onChange={this.handleDragVolume}/>
                </div>
            </div>
        );
    }
}

export default AudioBar;