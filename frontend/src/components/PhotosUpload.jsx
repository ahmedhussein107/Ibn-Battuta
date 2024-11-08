import styled from 'styled-components';

const PhotosUpload = ({ label, imagePreviews, onImageAdd, onImageRemove }) => {
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        const newImages = [];
        const processFile = (file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        id: Date.now() + Math.random(),
                        url: reader.result,
                        file: file
                    });
                };
                reader.readAsDataURL(file);
            });
        };



        Promise.all(files.map(processFile))
            .then(processedImages => {
                onImageAdd(processedImages);
            });

        e.target.value = '';
    };

    const getGridColumns = (count) => {
        if (count <= 1) return 1;
        if (count <= 2) return 2;
        if (count <= 4) return 2;
        return 3;
    };

    return (
        <PhotoUploadSection>
            <PhotoUploadLabel>{label}</PhotoUploadLabel>

            <UploadArea isEmpty={imagePreviews.length === 0}>
                {imagePreviews.length > 0 ? (
                    <PreviewsGrid columns={getGridColumns(imagePreviews.length)}>
                        {imagePreviews.map((image) => (
                            <PreviewContainer key={image.id}>
                                <RemoveButton
                                    onClick={() => onImageRemove(image.id)}
                                    aria-label="Remove image"
                                >
                                    ×
                                </RemoveButton>
                                <ImagePreview src={image.url} alt="Preview" />
                            </PreviewContainer>
                        ))}
                    </PreviewsGrid>
                ) : (
                    <PlaceholderIcon viewBox="0 0 24 24">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </PlaceholderIcon>
                )}

                <FileInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="photo-file-input"
                    multiple
                />
            </UploadArea>

            <UploadButton
                type="button"
                onClick={() => document.getElementById('photo-file-input').click()}
            >
                Choose Files
            </UploadButton>
        </PhotoUploadSection>
    );
};

const PhotoUploadSection = styled.div`
    text-align: center;
    background: #FAF4F4;
    padding: clamp(1em, 3vw, 2em);
    border-radius: 1em;
    box-shadow: 0 0.125em 0.5em rgba(0, 0, 0, 0.1);
    margin-bottom: 2em;
`;

const PhotoUploadLabel = styled.label`
    display: block;
    font-size: 1.1em;
    font-weight: 500;
    margin-bottom: 0.5em;
`;

const UploadArea = styled.div`
    background-color: #f5f5f5;
    border-radius: 0.5em;
    height: 15vh;
    min-height: ${props => props.isEmpty ? '10em' : '15em'};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1em;
    border: 2px dashed #e0e0e0;
    padding: 1em;
    overflow: auto;
`;

const PreviewsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(${props => props.columns}, 1fr);
    gap: 0.5em;
    width: 100%;
    height: 100%;
    padding: 0.5em;
`;

const PreviewContainer = styled.div`
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    border-radius: 0.5em;
    overflow: hidden;
    background: #f5f5f5;
`;

const ImagePreview = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.5em;
`;

const RemoveButton = styled.button`
    position: absolute;
    top: 0.25em;
    right: 0.25em;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    color: #ff5722;
    z-index: 1;
    padding: 0;
    line-height: 1;

    &:hover {
        background: rgba(255, 255, 255, 1);
        color: #f4511e;
    }
`;

const FileInput = styled.input``;

const UploadButton = styled.button`
    padding: 0.75em 2em;
    border-radius: 0.5em;
    font-size: 1em;
    font-weight: 500;
    cursor: pointer;
    background-color: transparent;
    border: 0.0625em solid #f28b82;
    color: #f28b82;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(242, 139, 130, 0.1);
    }
`;

const PlaceholderIcon = styled.svg`
    width: 2em;
    height: 2em;
    fill: #9e9e9e;
`;

export default PhotosUpload;