import { Outlet } from '@remix-run/react';

export default () => {
  return (
    <div>
      <div className="grid grid-cols-5 gap-0">
        <div className="items-center justify-center hidden h-full min-h-screen col-span-2 p-5 bg-light-green md:flex">
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex">
              <div className="w-full">
                <p className="font-circular mt-11 text-primary-heading text-[24px]">
                  Learn and teach how to code
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="items-center justify-center col-span-5 p-5 sm:pt-10 md:flex md:h-full md:min-h-screen md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
