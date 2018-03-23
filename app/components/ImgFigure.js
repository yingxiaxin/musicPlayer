import React from 'react';
import imageFigureStyle from '../styles/imageFigure.css';

class ImgFigure extends React.Component
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

        e.stopPropagation();
        e.preventDefault();
    }

    render()
    {
        let styleObj = {};
        if(this.props.arrange.pos)
        {
            styleObj = this.props.arrange.pos;
        }

        if(this.props.arrange.rotate)
        {
            ['MozTransform', 'msTransform', 'WebkitTransform', 'transform'].forEach(value => 
            {
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            });            
        }

        if(this.props.arrange.isCenter)
        {
            styleObj.zIndex = 11;
        }

        let imgFigureClassName = this.props.arrange.isInverse ? imageFigureStyle.img_figure_inverse : imageFigureStyle.img_figure;

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption className={imageFigureStyle.figcap}>
                    <h2 className={imageFigureStyle.img_title}>{this.props.data.title}</h2>
                    <div className={imageFigureStyle.img_back} onClick={this.handleClick}>
                        <p>{this.props.data.desc}</p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}



export default ImgFigure;