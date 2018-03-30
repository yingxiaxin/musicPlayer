import React from 'react';
import HttpRequest from './HttpRequest';
import '../styles/lyric.less';

class Lyric extends React.Component
{
    constructor(props)
    {
        super(props);
        this.showMusicInfo = this.showMusicInfo.bind(this);
        this.updateLyric = this.updateLyric.bind(this);
        this.renderLyric = this.renderLyric.bind(this);
        this.setLineHighLight = this.setLineHighLight.bind(this);

        this.lyricArray = [];
        this.currentLine = 10000;
        this.requestAnimationFrameFlag = 0;
    }

    showMusicInfo(songinfo)
    {
        let picNode = document.getElementById('pic');

        let songID = songinfo.id;

        //获取歌曲对应的图片
        let picUrl = 'http://localhost:3000/song/detail';
        let picObj = 
        {
            ids: songID
        };

        HttpRequest.get(picUrl, picObj, (data)=>
        {
            let o = JSON.parse(data);
            if(o.code == 200)
            {
                let rstObj = JSON.parse(data);
                let picUrl = rstObj.songs[0].al.picUrl;

                //给img标签重新赋src值
                picNode.src = picUrl;
            }
            else
            {
                alert(o.msg);
            }
        });


        //获取歌曲的歌词
        let lyricUrl = 'http://localhost:3000/lyric';
        let lyricObj = 
        {
            id: songID
        };

        HttpRequest.get(lyricUrl, lyricObj, (data)=>
        {
            let o = JSON.parse(data);
            if(o.code == 200)
            {
                let rstObj = JSON.parse(data);

                //将歌词数据转换成对象数组
                let strArray = rstObj.lrc.lyric.split('\n');
                let objArray = [];
                strArray.forEach((str, index) => 
                {
                    let o = {};
                    let rst = str.split(']');
                    o.lyric = (rst[1] == undefined ? '' : rst[1]);
                    let timeArray = rst[0].substring(1).split(':'); //将xx:xx的时间转成秒的格式
                    o.time = parseFloat(timeArray[0] * 60) + parseFloat(timeArray[1]);   

                    objArray.push(o);
                });
                this.lyricArray = objArray;
                this.renderLyric(this.lyricArray);
            }
            else
            {
                alert(o.msg);
            }
        });
    }

    renderLyric(array)
    {
        let ulNode = document.getElementById('lyricUl');
        ulNode.innerHTML = '';
        ulNode.scrollTop = 0;

        this.lyricArray.forEach((ele, index, array) => 
        {
            let li = document.createElement('li');
            li.innerHTML = ele.lyric;
            ulNode.appendChild(li);
        });
    }

    updateLyric(timevalue)
    {
        let uldom = document.getElementById('lyricUl');

        this.lyricArray.forEach((item, index, array) => 
        {
            if(timevalue > parseFloat(array[index].time) && timevalue <= parseFloat(array[index + 1].time))
            {
                if(this.currentLine == index)
                {
                    return;
                }
                else
                {
                    this.currentLine = index;
                    this.setLineHighLight(index);
                }
            }
        });
    }

    setLineHighLight(lineNumber)
    {
        let ul = document.getElementById('lyricUl');
        let liArray = ul.getElementsByTagName('li');
        let that = this;

        if(lineNumber > liArray.length)
        {
            return;
        }
        else
        {
            Array.prototype.forEach.call(liArray, (item, index) => 
            {
                if(index == lineNumber)
                {
                    addClass(item, 'highlighted');
                    // ul.scrollTop = lineNumber * 35;

                    scrollTo(ul, lineNumber * 35, 300);
                }
                else
                {
                    removeClass(item, 'highlighted');
                }
            });
        }

        function scrollTo(dom, value, time)
        {
            //每次先取消上次的requestanimationframe，不然滚动条会瞎jb滚
            cancelAnimationFrame(that.requestAnimationFrameFlag);

            let stepTime = 15;
            let current = dom.scrollTop,
                gap = value - current,
                stepNum = time / stepTime,
                step = gap / stepNum;                
            scrollUl();

            function scrollUl()
            {
                that.requestAnimationFrameFlag = requestAnimationFrame(scrollUl);

                if(dom.scrollTop >= value)
                {
                    dom.scrollTop = value;
                    cancelAnimationFrame(that.requestAnimationFrameFlag);
                }
                else
                {
                    dom.scrollTop = dom.scrollTop + step;
                }
            }            
        }        

        function removeClass(ele, classname)
        {
            if(hasClass(ele, classname) == true)
            {
                var reg = new RegExp("(^|\\s)" + classname + "(\\s|$)");
                ele.className = ele.className.replace(reg, "");
            }
            else
            {
                return;
            }
        }

        function addClass(ele, classname)
        {
            if(hasClass(ele, classname) == true)
            {
                return;
            }
            else
            {
                ele.className = ele.className + " " + classname;
            }
        }

        function hasClass(ele, classname)
        {
            var reg = new RegExp("(^|\\s)" + classname + "(\\s|$)");
            if(ele.className.match(reg) != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    render()
    {
        return (
            <div className="lyric">
                <img src="http://7xrkxs.com1.z0.glb.clouddn.com/music/default_album.jpg" alt="图片未找到" id="pic"/>
                <div>
                    <ul id="lyricUl">

                    </ul>
                </div>
            </div>
        );
    }
}

export default Lyric;