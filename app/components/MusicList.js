import React from 'react';
import MusicItem from './MusicItem';
import '../styles/musicList.less';

class MusicList extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = 
        { 
            songArray: 
            [
               
            ]
        }; 
        // this.songArray = [];
    }

    renderList(array)
    {
        let songArray = this.state.songArray;
        songArray = [];

        array.forEach((ele, index, array) => 
        {
            ele['index'] = index + 1;
            songArray.push(<MusicItem info={ele} playCallback={this.props.playCallback}/>);
        });

        this.setState({songArray: songArray});


        //列表的滚动条在每次搜索后都回到最顶部
        let musicList = document.getElementsByClassName('musicList')[0];
        musicList.scrollTop = 0;

        //让列表中的每一项前面的播放状态gif背景置空，以免播放过程中直接搜索另外的歌曲造成看上去新搜索的歌曲在播放的状态
        let list = document.getElementsByClassName('list')[0];
        let musicItemArray = list.getElementsByClassName('musicItem');
        Array.prototype.forEach.call(musicItemArray, (item, index, array) => 
        {
            let span = item.getElementsByClassName('order')[0];
            span.style.background = 'none';
        });
    }

    render()
    {
        return (
            <div className="musicList">
                <div className="title">
                    <span></span>
                    <span>歌曲</span>
                    <span>歌手</span>
                    <span>专辑</span>
                </div>
                <div className="list">
                    {this.state.songArray}
                </div>
            </div>
        );
    }
}

export default MusicList;