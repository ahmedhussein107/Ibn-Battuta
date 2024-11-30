import Pagination from "@mui/material/Pagination";
import "./Pagination.css";
const PaginationComponent = ({ totalPages, currentPage, onChange }) => {
    return (
        <div className="pagination-div">
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={onChange}
                variant="outlined"
                color="#f86624"
                sx={{
                    "& .MuiPaginationItem-root": {
                        // backgroundColor: "#f0f0f0",
                        backgroundColor: "#FAE2B6",
                        color: "var(--accent-color)",
                        "&:hover": {
                            backgroundColor: "var(--accent-color)",
                            color: "#fff",
                        },
                        "&.Mui-selected": {
                            backgroundColor: "var(--accent-color)", // Accent background when selected
                            color: "#fff", // White text when selected
                            "&:hover": {
                                backgroundColor: "var(--accent-color-dark)", // Darker accent on hover for selected
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default PaginationComponent;
