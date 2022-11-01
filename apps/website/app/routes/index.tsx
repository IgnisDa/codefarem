import { Link } from '@remix-run/react';
import { route } from 'routes-gen';

export default () => {
  return (
    <div>
      <h1 className="text-2xl">CodeFarem</h1>
      <div>
        <Link className="underline" to={route('/auth/logout')}>
          Logout
        </Link>
      </div>
    </div>
  );
};
