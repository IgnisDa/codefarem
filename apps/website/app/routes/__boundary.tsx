import { Outlet, useCatch } from '@remix-run/react';
import { ErrorPage } from '~/lib/components/ErrorPage';
import type { CatchBoundaryComponent } from '@remix-run/react/dist/routeModules';
import type { ErrorBoundaryComponent } from '@remix-run/server-runtime';

// We have to use this workaround because of a bug in Remix
// https://github.com/remix-run/remix/issues/1136. Solution taken from
// https://github.com/remix-run/remix/issues/1136#issuecomment-1314519567

export default () => {
  return <Outlet />;
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorPage
      statusCode={500}
      message={'Internal Server Error'}
      description={
        "Our servers could not handle your request. Don't worry, our development team was already notified."
      }
      stack={error.stack}
    />
  );
};

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();

  return (
    <ErrorPage
      statusCode={caught?.status}
      message={caught?.data?.message || 'Not Found'}
      description={
        caught?.data?.description ||
        'We could not find what you were looking for. If you think it should be here, please contact us.'
      }
    />
  );
};
