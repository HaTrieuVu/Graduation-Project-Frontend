import React from 'react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

import './HeaderSlider.scss';
import bannerMain1 from "../../assets/banner-main-1.webp"
import bannerMain2 from "../../assets/banner-main-2.webp"
import bannerMain3 from "../../assets/banner-main-3.webp"
import bannerMain4 from "../../assets/banner-main-4.webp"
import banner1 from "../../assets/banner-1.webp"
import banner2 from "../../assets/banner-2.webp"

const HeaderSlider = () => {
    let settings = {
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="slider">
            <div className="container container-slider">
                <div className="slider-content-main overflow-x-hidden">
                    <Slider {...settings}>
                        <div className="slider-item">
                            <img src={bannerMain1} alt="slider-img" />
                        </div>
                        <div className="slider-item">
                            <img src={bannerMain2} alt="slider-img" />
                        </div>
                        <div className="slider-item">
                            <img src={bannerMain3} alt="slider-img" />
                        </div>
                        <div className="slider-item">
                            <img src={bannerMain4} alt="slider-img" />
                        </div>
                    </Slider>
                </div>
                <div className='slider-right'>
                    <div className="slider-item-right">
                        <img src={banner1} alt="slider-img" />
                    </div>
                    <div className="slider-item-right">
                        <img src={banner2} alt="slider-img" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderSlider;
