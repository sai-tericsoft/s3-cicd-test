import "./PaginationComponent.scss";
import {TablePagination} from "@mui/material";

interface PaginationComponentProps {
    id?: string;
    paginationOptions: number[];
    totalResults: number;
    page: number;
    limit: number;
    onPageChange: any;
    onRowsPerPageChange: any;
    className?: string;
}

const PaginationComponent = (props: PaginationComponentProps) => {

    const {paginationOptions, page, limit, totalResults, onPageChange, onRowsPerPageChange, className} = props;

    const id = props.id || "table-pagination";

    return (
        <TablePagination
            id={id}
            rowsPerPageOptions={paginationOptions}
            className={`pagination-component ${className}`}
            component="div"
            labelDisplayedRows={(paginationInfo) => {
                return <>
                    <span id={`${id}_from`}>{paginationInfo.from}</span> - <span
                    id={`${id}_to`}>{paginationInfo.to}</span> of <span
                    id={`${id}_total_count`}>{paginationInfo.count !== -1 ? paginationInfo.count : 'more than' + paginationInfo.count}</span>
                </>
            }}
            // showFirstButton={true}
            // showLastButton={true}
            count={totalResults}
            rowsPerPage={limit}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
        />
    );

};

export default PaginationComponent;
