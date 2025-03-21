import React from 'react';
import './Loader.scss';
import loader from '../../assets/loader.svg';

const Loader = () => {
    return (
        <div className="container">
            <div className="loader flex justify-center align-center">
                <img src={loader} alt="loading..." />
            </div>
        </div>
    );
};

export default Loader;
