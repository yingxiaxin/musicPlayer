import React from 'react';
import '../styles/musicItem.less';

class MusciItem extends React.Component
{
    constructor(props)
    {
        super(props);
        this.playMusic = this.playMusic.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    handleMouseOver(e)
    {
        let domNode = e.currentTarget;
        let aTag = domNode.getElementsByTagName('a')[0];
        aTag.style.display = 'block';
    }

    handleMouseOut(e)
    {
        let domNode = e.currentTarget;
        let aTag = domNode.getElementsByTagName('a')[0];
        aTag.style.display = 'none';
    }

    playMusic(e)
    {
        //阻止事件传播，不然由于transform点了一行可能触发另外一行的点击事件，造成有两个播放效果
        e.preventDefault();
        e.stopPropagation();

        let audio = this.props.playCallback;
        audio(this.props.info);

        addPlayIcon(e);

        function addPlayIcon(e)
        {
            let itemNode = e.currentTarget.parentNode.parentNode,
                currentSpan = itemNode.getElementsByClassName('order')[0];
            
            currentSpan.style.background = 'url(./wave.gif) no-repeat 0% 50%';

            cancelNextItemIcon(itemNode);
            cancelPrevItemIcon(itemNode);
        }

        function cancelNextItemIcon(node)
        {
            if(node.nextSibling != null && node.nextSibling.className == 'musicItem')
            {
                let next = node.nextSibling;
                let span = next.getElementsByClassName('order')[0];
                span.style.background = 'none';

                cancelNextItemIcon(next);
            }
        }

        function cancelPrevItemIcon(node)
        {
            if(node.previousSibling != null && node.previousSibling.className == 'musicItem')
            {
                let prev = node.previousSibling;
                let span = prev.getElementsByClassName('order')[0];
                span.style.background = 'none';

                cancelPrevItemIcon(prev);
            }
        }
    }

    render()
    {
        return (
            <div className="musicItem" onMouseOver={this.handleMouseOver}
                                       onMouseOut={this.handleMouseOut} >
                <span className="order" ref="playStatusSpan">{this.props.info.index}</span>
                <span className="musicName">{this.props.info.name}</span>
                <span className="playBtn" onClick={this.playMusic}>
                    <a href="javascript:void(0)" onClick={this.playMusic}></a>
                </span>
                <span className="singer">{this.props.info.artists[0].name}</span>
                <span className="album">{this.props.info.album.name}</span>
            </div>
        );
    }
}

export default MusciItem;