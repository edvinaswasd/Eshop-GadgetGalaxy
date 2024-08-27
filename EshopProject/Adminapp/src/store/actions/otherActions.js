import { COMPANY_SWITCH } from './types.js';

export const switchCompany = (company)=>(dispatch)=>{
    dispatch({
        type:COMPANY_SWITCH,
        payload:{company}
    })
}