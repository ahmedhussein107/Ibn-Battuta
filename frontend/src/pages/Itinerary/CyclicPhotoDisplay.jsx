import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const CyclicPhotoDisplay = ({ photos, width, height }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % photos.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [photos.length]);

    return (
        <Container width={width} height={height}>
            <LeftPhoto photoUrl={photos[index]} />
            <RightColumn>
                <TopRightPhoto photoUrl={photos[(index + 1) % photos.length]} />
                <BottomRightPhoto photoUrl={photos[(index + 2) % photos.length]} />
            </RightColumn>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    width: ${({ width }) => width || '100%'};
    height: ${({ height }) => height || '100%'};
    gap: 1em;
`;

const LeftPhoto = styled.div`
    flex: 1; 
    background-image: url(${({ photoUrl }) => photoUrl});
    background-size: cover;
    background-position: center;
    transition: background-image 1.2s ease; 
    border-radius:30px
`;

const RightColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1.5;
    gap: 1em;
`;

const TopRightPhoto = styled.div`
    flex: 1;
    background-image: url(${({ photoUrl }) => photoUrl});
    background-size: cover;
    background-position: center;
    transition: background-image 1.2s ease;
     border-radius:30px
`;

const BottomRightPhoto = styled.div`
    flex: 1;
    background-image: url(${({ photoUrl }) => photoUrl});
    background-size: cover;
    background-position: center;
    transition: background-image 1.2s ease;
     border-radius:30px
`;

export default CyclicPhotoDisplay;