import React, { Suspense, lazy } from "react";
const LazyText = lazy(() => import("./lazy"));
function Loading() {
  return (
    <div>
        <div className='flex justify-center items-center h-screen text-6xl font-bold'>
        <Suspense fallback={<div>Loading...</div>}>
        <LazyText />
      </Suspense>
</div>
    </div>
  )
}

export default Loading