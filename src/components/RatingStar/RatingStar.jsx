import { IoIosStar } from "react-icons/io";

import "./RatingStar.scss"

const RatingStar = ({ star = 0, maxStars = 5 }) => {
    return (
        <div className="box-rating flex">
            {Array.from({ length: maxStars }).map((_, index) => (
                <span key={index} className={index < star ? "star-active" : "star"}>
                    <IoIosStar size={20} />
                </span>
            ))}
        </div>
    );
};

export default RatingStar;
