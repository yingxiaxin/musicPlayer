import imageDatas from '../data/imageData.json';
import React from 'react';
import ReactDom from 'react-dom';
import stageStyle from '../styles/stage.css';
import ImgFigure from './ImgFigure';
import ControllerUnit from './ControllerUnit';

let imgDatas = imageDatas;
imgDatas = (function genImageURL(imageDatasArr)
                {
                    for(let i=0; i<imageDatasArr.length; i++)
                    {
                        let singleImageData = imageDatasArr[i];
                        singleImageData.imageURL = require('../../images/' + singleImageData.fileName);
                        imageDatasArr[i] = singleImageData;
                    }
                    return imageDatasArr;
                })(imgDatas);


let getRangeRandom = function(low, high)
{
   return Math.ceil(Math.random() * (high - low) + low);
}

let get30DegRandom = function()
{
    return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
}


class GalleryByReactApp extends React.Component
{
    constructor(props) 
    {
        super(props); // 设置 initial state 
        this.state = 
        { 
            imgsArrangeArr: 
            [
                /*{
                    pos: 
                    {
                        left: '0',
                        top: '0'
                    }
                }*/
            ]
        }; 

        // ES6 类中函数必须手动绑定 
        //this.handleChange = this.handleChange.bind(this); 

        this.Constant =  
        {
            centerPos:
            {
                left: 0,
                right: 0,
            },
            hPosRange:
            {
                leftSecX: [0, 0],
                rightSecX: [0, 0],
                y: [0, 0]
            },
            vPosRange:
            {
                x: [0, 0],
                topY: [0,0]
            }
        }
    }

    Constant;

    inverse(index)
    {
        return function()
        {
            let imgsArrangeArr = this.state.imgsArrangeArr;

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
    }

    center(index)
    {
        return function()
        {
            this.rearrange(index);
        }.bind(this);
    }

    rearrange(centerIndex)
    {
        let imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        imgsArrangeCenterArr[0].pos = centerPos;
        imgsArrangeCenterArr[0].rotate = 0;
        imgsArrangeCenterArr[0].isCenter = true;

        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        imgsArrangeTopArr.forEach((value, index) => 
        {
            imgsArrangeTopArr[index] = 
            {
                pos: 
                {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            }            
        });

        for(let i=0, j=imgsArrangeArr.length, k=j/2; i<j; i++)
        {
            let hPosRangeLORX = null;

            if(i < k)
            {
                hPosRangeLORX = hPosRangeLeftSecX;
            }
            else
            {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = 
            {
                pos: 
                {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            }            
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0])
        {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });

    }

    componentDidMount()
    {
        let stageDOM = ReactDom.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        let imgFigureDOM = ReactDom.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        this.Constant.centerPos = 
        {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = stageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
    }

    render()
    {
        let controllerUnits = [],
            imgFigures = [];
        
        imgDatas.forEach((element, index) => 
        {
            if(!this.state.imgsArrangeArr[index])
            {
                this.state.imgsArrangeArr[index] = 
                {
                    pos: 
                    {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(<ImgFigure data={element} ref={"imgFigure" + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);  
            
            controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
        });

        return (
            <section className={stageStyle.stage} ref="stage">
                <section className={stageStyle.img_sec}>
                    {imgFigures}
                </section>
                <nav className={stageStyle.controller_nav}>
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}




export default GalleryByReactApp;
