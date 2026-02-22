import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizeMap = { sm: '1rem', md: '2rem', lg: '3rem' };

    return (
        <div className="loading-spinner">
            <FaSpinner
                className="spin-animation"
                style={{ fontSize: sizeMap[size] || sizeMap.md }}
            />
            {text && <p className="loading-text">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
