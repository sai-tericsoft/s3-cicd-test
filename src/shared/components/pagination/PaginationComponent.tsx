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
}

const PaginationComponent = (props: PaginationComponentProps) => {

    const {paginationOptions, page, limit, totalResults, onPageChange, onRowsPerPageChange} = props;
    const id = props.id || "table-pagination";

    return (
        <TablePagination
            id={id}
            rowsPerPageOptions={paginationOptions}
            component="div"
            labelDisplayedRows={( paginationInfo)=> {
                return <>
                    <span>{paginationInfo.from}</span> - <span>{paginationInfo.to}</span> of <span className={`${id}`+"_total_count"}>{paginationInfo.count !== -1 ? paginationInfo.count : 'more than' + paginationInfo.count}</span>
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