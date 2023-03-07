import {IActionModel} from "../../shared/models/action.model";

export interface IBillingsReducerState {

}

const initialData: IBillingsReducerState = {


}

export const BillingReducer = (state = initialData, action: IActionModel): any => {
    switch (action.type) {


        default:
            return state
    }
}
