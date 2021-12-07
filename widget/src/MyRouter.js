import React from 'react';
import {RouterProps, withRouter} from 'react-router';
import {ClientRouter} from '@shopify/app-bridge-react';

function MyRouter(props) {
    const {history} = props;
    return <ClientRouter history={history} />;
 
};
export default withRouter(MyRouter);