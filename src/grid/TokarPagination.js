import React from "react";
import TablePagination from '@mui/material/TablePagination';
import { withTranslation } from 'react-i18next';

class TokarPagination extends React.Component {
    constructor(props) {
        super(props)     
        this.state = {
            page: 0,
            pageSize: 10
        }  
    }

    render() {
        console.log(this.props.pagination)
        return <TablePagination 
            sx={{
                '.MuiTablePagination-toolbar': {
                    color: "#ffffff"
                },
            }}
            component="div"
            count={this.props.pagination}
            page={0}
            rowsPerPage={10}
            shape="rounded" 
            color="primary" />
    }
}

export default withTranslation()(TokarPagination);