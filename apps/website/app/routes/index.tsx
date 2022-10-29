import { Link } from '@remix-run/react';
import { $path } from 'remix-routes';

export default () => {
  return (
    <div>
      <h1 className="text-2xl">CodeFarem</h1>
      <div>
        <Link className="underline" to={$path('/auth/logout')}>
          Logout
        </Link>
      </div>
    </div>
  );
};
