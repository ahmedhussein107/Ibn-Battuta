import { useEffect } from "react";
import { useHeader } from "./HeaderContext";

const usePageHeader = (
    imageSrc,
    text,
    SearchBarComponent = null,
    ProfilePictureComponent = null
) => {
    console.log("useHeader is", useHeader());
    const { setHeaderData } = useHeader();

    useEffect(() => {
        setHeaderData({ imageSrc, text, SearchBarComponent, ProfilePictureComponent });
    }, [setHeaderData, imageSrc, text, SearchBarComponent, ProfilePictureComponent]);
};

export default usePageHeader;
