import { useCatch } from '@remix-run/react';
import { ErrorPage } from '~/lib/components/ErrorPage';

// needed to tell remix that this isn't a resource route
export default function CatchAllPage() {
  const caught = useCatch();

  return (
    <ErrorPage
      statusCode={caught?.status || 404}
      message={caught?.data?.message || 'Not Found'}
      description={
        caught?.data?.description ||
        'We could not find what you were looking for. If you think it should be here, please contact us.'
      }
    />
  );
}
