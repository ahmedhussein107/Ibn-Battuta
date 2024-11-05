import Pagination from "@mui/material/Pagination";

const PaginationComponent = ({ totalPages, currentPage, onChange }) => {
    return (
        <div>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={onChange}
                variant="outlined"
                shape="rounded"
            />
        </div>
    );
};
