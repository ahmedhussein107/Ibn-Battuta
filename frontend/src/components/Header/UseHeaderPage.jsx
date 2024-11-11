import { useEffect } from "react";
import { useHeader } from "./HeaderContext";

const usePageHeader = (
    imageSrc = null,
    text,
    SearchBarComponent = null,
    ProfilePictureComponent = null
) => {
    console.log("useHeader is", useHeader());
    const { setHeaderData, clearHeader } = useHeader();

    useEffect(() => {
        // Set the header data for this component
        setHeaderData({ imageSrc, text, SearchBarComponent, ProfilePictureComponent });

        // Clear the header on component unmount to prevent overlap
        return () => clearHeader();
    }, [
        setHeaderData,
        imageSrc,
        text,
        SearchBarComponent,
        ProfilePictureComponent,
        clearHeader,
    ]);
};

export default usePageHeader;
