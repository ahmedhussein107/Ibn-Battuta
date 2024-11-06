import { useEffect } from "react";
import { useHeader } from "./HeaderContext";

const usePageHeader = (imageSrc, text) => {
    console.log("useHeader is", useHeader());
    const { setHeaderData } = useHeader();

    useEffect(() => {
        setHeaderData({ imageSrc, text });
    }, [setHeaderData, imageSrc, text]);
};

export default usePageHeader;
