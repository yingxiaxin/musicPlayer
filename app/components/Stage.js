import React from 'react';
import SearchBar from './SearchBar';
import AudioBar from './AudioBar';
import MusicList from './MusicList';
import Lyric from './Lyric';
import HttpRequest from './HttpRequest';
import '../styles/stage.less';

class Stage extends React.Component
{
    constructor(props)
    {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleMusicList = this.handleMusicList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.playSong = this.playSong.bind(this);
        this.showMusicInfo = this.showMusicInfo.bind(this);
        this.updateLyricPos = this.updateLyricPos.bind(this);




        this.userInactive = 0;  //实现监听鼠标是否长时间未移动的 settimeout函数返回值存放变量
        this.listenInterval = 30000;
        this.range = 300;

        this.transformIntervalArray = [0, 0, 0, 0];
        this.transformTypeArray = ['translateX', 'translateY', 'translateZ'];
        this.transformInterval = 8000;

        //歌曲列表的数组
        this.songs = [];
    }

    handleClick(e)
    {

    }

    handleMouseMove(e)
    {
        clearTimeout(this.userInactive);
        this.endTransform();

        this.userInactive = setTimeout(() => 
        {
            this.startTransform();
        }, this.listenInterval);
    }

    startTransform()
    {
        let audio = document.getElementsByClassName('audioBar')[0],
            search = document.getElementsByClassName('searchBarContainer')[0],
            musiclist = document.getElementsByClassName('musicList')[0],
            lyric = document.getElementsByClassName('lyric')[0],
            listcontainer = document.getElementsByClassName('listContainer')[0],
            stage = document.getElementsByClassName('stage')[0];

        stage.style.transform = 'rotateY(-45deg)';
        listcontainer.style.boxShadow = 'none';
        lyric.style.boxShadow = '0 0 20px rgba(146, 136, 189, 0.7)';
        musiclist.style.boxShadow = '0 0 20px rgba(146, 136, 189, 0.7)';

        //歌曲列表
        setTimeout(() => 
        {
            this.transformIntervalArray[0] = setInterval(() => 
            {
                let type = this.transformTypeArray[Math.floor(Math.random() * (2 - 0 + 1) + 0)];
                let value = (Math.random() > 0.5 ? 1 : -1) * this.range;
                musiclist.style.transform = type + '(' + value + 'px)';
            }, this.transformInterval);
        }, 1500);

        //控制条
        setTimeout(() => 
        {
            this.transformIntervalArray[1] = setInterval(() => 
            {
                let type = this.transformTypeArray[Math.floor(Math.random() * (2 - 0 + 1) + 0)];
                let value = (Math.random() > 0.5 ? 1 : -1) * this.range;
                audio.style.transform = type + '(' + value + 'px)';
            }, this.transformInterval);
        }, 3000);

        //搜索框
        setTimeout(() => 
        {
            this.transformIntervalArray[2] = setInterval(() => 
            {
                let type = this.transformTypeArray[Math.floor(Math.random() * (2 - 0 + 1) + 0)];
                let value = (Math.random() > 0.5 ? 1 : -1) * this.range;
                search.style.transform = type + '(' + value + 'px)';
            }, this.transformInterval);
        }, 4500);

        //歌词页
        setTimeout(() => 
        {
            this.transformIntervalArray[3] = setInterval(() => 
            {
                let type = this.transformTypeArray[Math.floor(Math.random() * (2 - 0 + 1) + 0)];
                let value = (Math.random() > 0.5 ? 1 : -1) * this.range;
                lyric.style.transform = type + '(' + value + 'px)';
            }, this.transformInterval);
        }, 6000);
    }

    endTransform()
    {
        let audio = document.getElementsByClassName('audioBar')[0],
        search = document.getElementsByClassName('searchBarContainer')[0],
        musiclist = document.getElementsByClassName('musicList')[0],
        lyric = document.getElementsByClassName('lyric')[0],
        listcontainer = document.getElementsByClassName('listContainer')[0],
        stage = document.getElementsByClassName('stage')[0];

        stage.style.transform = 'none';
        audio.style.transform = 'none';
        search.style.transform = 'none';
        musiclist.style.transform = 'none';
        lyric.style.transform = 'none';
        listcontainer.style.transform = 'none';

        listcontainer.style.boxShadow = '0 0 20px rgba(146, 136, 189, 0.7)';
        lyric.style.boxShadow = 'none';
        musiclist.style.boxShadow = 'none';

        this.transformIntervalArray.forEach((item, index, array) => 
        {
            clearInterval(item);
        })
    }

    /**子组件使用的函数 */
    handleSearch(keywords)
    {
        let url = 'http://localhost:3000/search';
        let obj = 
        {
            keywords: keywords
        };

        HttpRequest.get(url, obj, (data)=>
        {
            let o = JSON.parse(data);
            if(o.code == 200)
            {
                this.songs = o.result.songs;
                this.handleMusicList(this.songs);
            }
            else
            {
                alert(o.msg);
            }
        });
    }

    handleMusicList(array)
    {
        let domNode = this.refs.musiclist;
        domNode.renderList(array);
    }

    playSong(songinfo)
    {
        let audioNode = this.refs.audioControl;
        audioNode.playSong(songinfo);

        this.showMusicInfo(songinfo);
    }

    showMusicInfo(songinfo)
    {
        let lyricNode = this.refs.lyric;
        lyricNode.showMusicInfo(songinfo);
    }

    updateLyricPos(timevalue)
    {
        let lyricNode = this.refs.lyric;
        lyricNode.updateLyric(timevalue);
    }


    render()
    {
        return (
            <div className="stage" onMouseMove={this.handleMouseMove}
                                   onClick={this.handleClick}>
                <SearchBar handleSearch={this.handleSearch}/>
                <div className="listContainer">
                    <MusicList ref="musiclist" playCallback={this.playSong}/>
                    <Lyric ref="lyric" lyricCallback={this.showMusicInfo}/>
                </div>
                <AudioBar ref="audioControl" updateLyricCallback={this.updateLyricPos}/>
            </div>
        );
    }
}

export default Stage;