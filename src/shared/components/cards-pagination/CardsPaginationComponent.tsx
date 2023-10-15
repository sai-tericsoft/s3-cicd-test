import "./CardsPaginationComponent.scss";
import {Pagination} from "@mui/lab";

interface CardsPaginationComponentProps {
    page: number;
    totalResultsRef: any;
    onPageChange: Function;
}

const CardsPaginationComponent = (props: CardsPaginationComponentProps) => {
    const {page, totalResultsRef, onPageChange} = props;
    return (
        <>
            {
                Math.floor( totalResultsRef.current / 20) > 0 ?
                    <div className={'cards-pagination-component'}>
                        <Pagination
                            variant="outlined"
                            shape="rounded"
                            count={Math.ceil( totalResultsRef.current / 20)}
                            onChange={(event, value) => {
                                onPageChange(event, value)
                            }}
                            page={page}
                        />
                    </div> :
                    <></>
            }
        </>
    );

};

export default CardsPaginationComponent;
