/**
 * Asynchronously load component
 */
import loadable from 'loadable-components';

import LoadingIndicator from '../../components/Pages/ContentLoading';

export default loadable(() => import('.'), {
  LoadingComponent: LoadingIndicator
});
