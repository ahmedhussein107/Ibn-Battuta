import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/NavBar";
import styled from "styled-components";
import { fetchAllTags } from "../../pages/Tag/fetchAllTags"; // Import the new fetchAllTags function

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  min-height: 10vh;
  padding: 0px;
  position: absolute;
`;

const HeaderImage = styled.img`
  width: 100%;
  height: 30vh;
  object-fit: stretch;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
`;

const ProfileImage = styled.img`
  width: 30vh;
  height: 30vh;
  border-radius: 50%;
  box-shadow: 0vh 0.4vh 0.4vh rgba(0, 0, 0, 0.25);
  position: relative;
  top: 20vh; /* Adjusts profile image overlap with the header */
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2vh; /* Increased space between buttons */
  margin-top: 6vh; /* Adjusted space from the header image */
  position: relative;
  z-index: 2;
`;

const Button = styled.button`
  padding: 1vh 2vh;
  font-size: 1.5vh;
  font-weight: bold;
  border: none;
  border-radius: 0.5vh;
  cursor: pointer;
`;

const ChangePassword = styled(Button)`
  width: 20vh;
  height: 5vh;
  background: white;
  border-radius: 20vh;
  border: 0.1vh solid black;
  color: black;
`;

const DeleteAccount = styled(Button)`
  width: 20vh;
  height: 5vh;
  background: white;
  border-radius: 20vh;
  border: 0.1vh solid #d00c09;
  color: red;
`;

const EditProfile = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  cursor: pointer;
  width: 20vh;
  height: 5vh;
  background: white;
  border-radius: 100px;
  border: 1px solid black;
  color: black;
  z-index: 2;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin-top: 100px; /* Pushes content below the overlapping profile image */
  z-index: 2;
`;

const ProfileDetailsBox = styled.div`
  width: 831px;
  background: white;
  box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 20px;
  position: relative;
`;

const InfoBoxesContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const WalletBox = styled.div`
  width: 378px;
  background: white;
  box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const WalletHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const WalletIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const Balance = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
`;

const PointsSection = styled.div`
  margin-top: 10px;
  font-size: 16px;
`;

const Level = styled.p`
  font-size: 16px;
  margin: 5px 0;
`;


const PointsBox = styled.div`
  margin-top: 20px;
`;

const RedeemBox = styled.div`
  width: 378px;
  background: white;
  box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
`;

const InputBox = styled.input`
  width: 100px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  margin: 5px;
`;

const Arrow = styled.span`
  font-size: 24px;
  font-weight: bold;
  margin: 0 10px;
`;

const RedeemButton = styled.button`
  padding: 10px 20px;
  background-color: #f86624;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
`;

const PreferenceTagsBox = styled.div`
  width: 831px;
  background: white;
  box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  margin-top: 20px;
`;

const TagBubble = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: #ffe0cc;
  color: black;
  border-radius: 15px;
  padding: 5px 10px;
  margin: 5px;
  font-size: 14px;
`;

const CloseButton = styled.span`
  margin-left: 8px;
  cursor: pointer;
  color: black;
  font-weight: bold;
`;

const Dropdown = styled.select`
  margin-top: 10px;
  padding: 5px;
`;

export default function TouristProfilePage() {
  const [tourist, setTourist] = useState(null);
  const [tags, setTags] = useState([]); // State to store fetched tags
  const [selectedTags, setSelectedTags] = useState([]); // State to store selected tags

  useEffect(() => {
    // Fetch tourist data
    axiosInstance
      .get("/tourist/tourist", { withCredentials: true })
      .then((response) => {
        setTourist(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tourist:", error);
      });

    // Fetch tags for preferences
    fetchAllTags()
      .then((data) => setTags(data))
      .catch((error) => console.error("Error fetching tags:", error));
  }, []);

  const handleTagSelect = (event) => {
    const selectedTag = event.target.value;
    if (selectedTag && !selectedTags.includes(selectedTag)) {
      setSelectedTags([...selectedTags, selectedTag]);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <PageWrapper>
      <Navbar />
      <HeaderImage src="image 43.png" alt="Header Image" />
      <ProfileImage src="stylish-man-flat-vector-profile-picture-ai-generated_606187-310.avif" alt="Profile Image" />
      <ButtonContainer>
        <ChangePassword>Change Password</ChangePassword>
        <DeleteAccount>Delete Account</DeleteAccount>
      </ButtonContainer>
      <MainContent>
        <InfoBoxesContainer>
          <ProfileDetailsBox>
            <h2>Profile Details</h2>
            <p><strong>Email:</strong> {tourist?.email}</p>
            <p><strong>Mobile:</strong> {tourist?.mobile || "Not Provided"}</p>
            <p><strong>Nationality:</strong> {tourist?.nationality || "Not Provided"}</p>
            <p><strong>Date of Birth:</strong> {tourist?.DOB ? new Date(tourist.DOB).toLocaleDateString() : "Not Provided"}</p>
            <p><strong>Job:</strong> {tourist?.job || "Not Provided"}</p>
            <p><strong>Address:</strong>
              <Dropdown>
                {tourist?.addresses?.map((address, index) => (
                  <option key={index} value={address}>{address}</option>
                )) || <option>No addresses available</option>}
              </Dropdown>
            </p>
            <p><strong>Preferred Currency:</strong>
              <Dropdown>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="EGP">EGP</option>
              </Dropdown>
            </p>
            <EditProfile>Edit Profile</EditProfile>
          </ProfileDetailsBox>
          <WalletBox>
            <WalletHeader>
                <h3>Wallet Details</h3>
                <WalletIcon src="image 55.png" alt="Wallet Icon" />
            </WalletHeader>
            <Balance>Balance: ${tourist?.wallet || 0}</Balance>
            <PointsSection>
                <h3>My Points</h3>
                <Level>Level: {(tourist?.points <100000?1:tourist?.points>100000&&tourist?.points<500000?2:3)}</Level>
                <p>Points: {tourist?.points || 0}</p>
            </PointsSection>
            </WalletBox>

        </InfoBoxesContainer>
        <InfoBoxesContainer>
          <PreferenceTagsBox>
            <h3>Preference Tags</h3>
            <Dropdown onChange={handleTagSelect} value="">
              <option value="">Add Tags</option>
              {Object.keys(tags).length > 0 ? (
                Object.keys(tags).map((key) => (
                  <option key={key} value={tags[key]}>
                    {tags[key]}
                  </option>
                ))
              ) : (
                <option>No tags available</option>
              )}
            </Dropdown>
            <div style={{ marginTop: "10px" }}>
              {selectedTags.map((tag, index) => (
                <TagBubble key={index}>
                  {tag}
                  <CloseButton onClick={() => handleTagRemove(tag)}>×</CloseButton>
                </TagBubble>
              ))}
            </div>
          </PreferenceTagsBox>
          <RedeemBox>
            <h3>Redeem Points</h3>
            <InputBox type="number" placeholder="Points" />
            <Arrow>→</Arrow>
            <InputBox type="text" placeholder="Value" readOnly />
            <RedeemButton>Redeem</RedeemButton>
          </RedeemBox>
        </InfoBoxesContainer>
      </MainContent>
    </PageWrapper>
  );
}
