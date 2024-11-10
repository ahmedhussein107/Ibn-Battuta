import React, { useState, useEffect } from 'react';

const ActivityPhotos = ({ photos, width, height, interval = 3000 }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
        }, interval);

        return () => clearInterval(timer); // Clean up the interval on component unmount
    }, [photos.length, interval]);

    return (
        <div
            style={{
                width: width,
                height: height,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '30px'
            }}
        >
            <img
                src={photos[currentPhotoIndex]}
                alt={`Slide ${currentPhotoIndex + 1}`}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
        </div>
    );
};

export default ActivityPhotos;
