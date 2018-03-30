import React from 'react';
import searchBarStyle from '../styles/searchBar.less';

import HttpRequest from './HttpRequest';


class SearchBar extends React.Component
{
    constructor(props) 
    {
		super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    
    handleKeyDown(e)
    {
        if(e.keyCode == '13')
        {
            e.preventDefault;
            this.handleClick(e);
        }
    }

    handleClick(e)
    {
        let keyword = document.getElementById('searchInput').value;
        if(keyword == '')
        {
            return;
        }
        this.props.handleSearch(keyword);

        e.stopPropagation();
        e.preventDefault();
    }

    render()
    {
        return (            
            <div className="searchBarContainer">
                <input type="text" name="" id="searchInput" placeholder="搜索关键字" onKeyDown={this.handleKeyDown}/>
                <span onClick={this.handleClick}><i></i></span>
            </div>
        );
    }
}

export default SearchBar;