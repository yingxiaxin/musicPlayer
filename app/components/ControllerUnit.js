import React from 'react';
import controllerStyle from '../styles/controller.css';

class ControllerUnit extends React.Component
{
    constructor(props)
    {
        super(props);
		this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e)
    {
        if(this.props.arrange.isCenter)
        {
            this.props.inverse();
        }
        else
        {
            this.props.center();
        }
        e.preventDefault();
        e.stopPropagation();
    }

    render()
    {
        let controller_unitClassName = controllerStyle.controller_unit;
        if(this.props.arrange.isCenter && this.props.arrange.isInverse)
        {
            controller_unitClassName = controllerStyle.controller_unit_center_inverse;
        }

        if(this.props.arrange.isCenter && !this.props.arrange.isInverse)
        {
            controller_unitClassName = controllerStyle.controller_unit_center;
        }

        if(!this.props.arrange.isCenter && !this.props.arrange.isInverse)
        {
            controller_unitClassName = controllerStyle.controller_unit;
        }

        return (
            <span className={controller_unitClassName} onClick={this.handleClick}></span>
        );
    }
}


export default ControllerUnit;