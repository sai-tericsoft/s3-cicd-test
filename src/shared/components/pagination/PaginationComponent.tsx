import "./PaginationComponent.scss";
import {TablePagination} from "@mui/material";

interface PaginationComponentProps {
    paginationOptions: number[];
    totalResults: number;
    page: number;
    limit: number;
    onPageChange: any;
    onRowsPerPageChange: any;
}

const PaginationComponent = (props: PaginationComponentProps) => {

    const {paginationOptions, page, limit, totalResults, onPageChange, onRowsPerPageChange} = props;

    return (
        <TablePagination
            rowsPerPageOptions={paginationOptions}
            component="div"
            count={totalResults}
            rowsPerPage={limit}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
        />
    );

};

export default PaginationComponent;