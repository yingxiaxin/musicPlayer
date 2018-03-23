import React from 'react';
import searchBarStyle from '../styles/searchBar.less';

class SearchBar extends React.Component
{
    constructor(props) 
    {
		super(props);
		this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(e)
    {
        alert('search');

        e.stopPropagation();
        e.preventDefault();
    }

    render()
    {
        // let styleObj = {};
        // if(this.props.arrange.pos)
        // {
        //     styleObj = this.props.arrange.pos;
        // }

        // if(this.props.arrange.rotate)
        // {
        //     ['MozTransform', 'msTransform', 'WebkitTransform', 'transform'].forEach(value => 
        //     {
        //         styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        //     });            
        // }

        // if(this.props.arrange.isCenter)
        // {
        //     styleObj.zIndex = 11;
        // }

        // let imgFigureClassName = this.props.arrange.isInverse ? imageFigureStyle.img_figure_inverse : imageFigureStyle.img_figure;

        return (            
            <div className="searchBarContainer">
                <input type="text" name="" id="" placeholder="搜索关键字"/>
                <span onClick={this.handleClick}><i></i></span>
            </div>
        );
    }
}

export default SearchBar;