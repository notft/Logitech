import React from 'react';


const GovDash = () => {

    return (
        <>
            <div className='flex flex-col justify-center items-center h-screen'>
                <div>
                    <h1 className='text-white text-4xl font-semibold'>Government Monitoring - LogiScale</h1>
                </div>
                <div className='rounded'>
                    <video width="320" height="240" autoPlay muted loop>
                        <source src="cctv1.mp4" type="video/mp4" />
                     
                       
                    </video>

                </div>
            </div>
        </>
    );
};

export default GovDash;
