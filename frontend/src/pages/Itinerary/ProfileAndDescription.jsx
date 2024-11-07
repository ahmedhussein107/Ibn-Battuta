import React from "react";
import styled from "styled-components";

const ProfileAndDescription = ({
	name,
	picture,
	description,
	width,
	height,
	fontSize,
}) => {

	return (
		<Container width={width} height={height} fontSize={fontSize}>
			<ProfileHeader>
				<ProfilePic picture={picture}></ProfilePic>
				<Name>{name}</Name>
			</ProfileHeader>
			<AboutSection>
				<SectionTitle>About This Itinerary</SectionTitle>
				<Description>{description}</Description>
			</AboutSection>
		</Container>
	);
};

const Container = styled.div`
	width: ${({ width }) => width || "100%"};
	height: ${({ height }) => height || "auto"};
	padding: 1em;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	font-size: ${({ fontSize }) => fontSize || "1em"};
`;

const ProfileHeader = styled.div`
	display: flex;
	align-items: center;
`;

const ProfilePic = styled.div`
	width: 3em;
	height: 3em;
	border-radius: 50%;
	background-image: url(${({ picture }) => picture});
	background-size: cover;
	background-position: center;
	transition: background-image 1.2s ease;
	// background-color: #d1d1d1;
	margin-right: 0.75em;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5em;
	color: #333;
	font-weight: bold;
`;

const Name = styled.h3`
	margin: 0;
	font-size: 1.2em;
	font-weight: bold;
`;

const AboutSection = styled.div`
	// flex: 1;
`;

const SectionTitle = styled.h3`
	margin: 0;
	font-size: 1.2em;
	font-weight: bold;
	padding-top: 2em;
`;

const Description = styled.p`
	margin: 0.5em 0 0;
	font-size: 1em;
`;

export default ProfileAndDescription;
