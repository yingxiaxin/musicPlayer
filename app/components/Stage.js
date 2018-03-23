import React from 'react';
import SearchBar from './SearchBar';
import AudioBar from './AudioBar';
import '../styles/stage.less';

class Stage extends React.Component
{
    constructor(props)
    {
        super(props);
		// this.handleClick = this.handleClick.bind(this);
    }

    render()
    {      

        return (
            <div className="stage">
                <SearchBar />
                <AudioBar />
            </div>
        );
    }
}

export default Stage;