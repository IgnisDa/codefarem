import { Link } from '@remix-run/react';
import { route } from 'routes-gen';

export default () => {
  return (
    <div>
      <h1>CodeFarem</h1>
      <div>
        <Link to={route('/auth/logout')}>Logout</Link>
      </div>
    </div>
  );
};
