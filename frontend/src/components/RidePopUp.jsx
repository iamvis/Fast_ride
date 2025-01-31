import React from 'react'

const RidePopUp = (props) => {
 

  return (
    <div>
    <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
     props.setRidePopUpPanel(false)
    }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
    <h3 className='text-2xl font-semibold mb-5'>New Ride Available</h3>

    <div className= "flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
            <img className="h-12 w-12 rounded-full object-cover" 
            src="https://www.thetopfamous.com/wp-content/uploads/2023/01/Hande-Ercel-Actress.jpg" alt="" />
        <h4 className="text-lg font-medium">kaka ki kaki</h4>
        </div>
        <h5 className="text-lg font-semibold" >2.2 km</h5>
    </div>
  

    <div className='flex gap-2 justify-between flex-col items-center'>
              <div className='w-full mt-5'>
            <div className='flex items-center gap-5 p-3 border-b-2'>
                <i className="ri-map-pin-user-fill"></i>
                <div>
                    <h3 className='text-lg font-medium'>562/11-A</h3>
                    <p className='text-sm -mt-1 text-gray-600'>sector B, Khandwa Naka</p>
                </div>
            </div>
            <div className='flex items-center gap-5 p-3 border-b-2'>
                <i className="text-lg ri-map-pin-2-fill"></i>
                <div>
                    <h3 className='text-lg font-medium'>562/11-A</h3>
                    <p className='text-sm -mt-1 text-gray-600'>Vijay Nagar, b Complex std</p>
                </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
                <i className="ri-currency-line"></i>
                <div>
                    <h3 className='text-lg font-medium'>₹9993</h3>
                    <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                </div>
            </div>
        </div>
        <button onClick={() => {
          props.setConfmRidePopUpPanel(true);
         
        }} 
        className='w-full mt-5 bg-green-600 text-white font-semibold p-5 rounded-lg'>Accept</button>
        <button onClick={() => {
        props.setRidePopUpPanel(false)
        
        }} 
        className='w-full mt-1 bg-gray-300 text-gray-700 font-semibold p-5 rounded-lg'>Ignore</button>
    </div>
</div>
  )
}

export default RidePopUp
