import React from 'react'
import { useContext } from 'react'

import {CaptainDataContext} from '../context/CaptainContext'

const CaptainDetails = () => {
 const {captain} = useContext(CaptainDataContext)

  return (
    <div>
       <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-3">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzKqdsqyVywFSqgt4EKebEZNBU1cUz84pLJA&s"
              alt=""
            />
            <h4 className="text-lg font-medium">{captain.fullname.firstname + " " + captain.fullname.lastname }</h4>
          </div>

          <div>
            <h4 className="text-xl font-semibold">₹44</h4>
            <p className="text-sm text-gray-600">Earned</p>
          </div>
        </div>

        <div className="flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start">
          <div className="text-center">
            <i className="ri-timer-line font-thin text-3xl mb-2"></i>
            <h5 className="text-lg font-medium">17.6</h5>
            <p className="text-sm text-gray-600">Hourse Online</p>
          </div>

          <div className="text-center">
            <i className="ri-speed-up-line font-thin text-3xl mb-2">
              <h5 className="text-lg font-medium">17.6</h5>
              <p className="text-sm text-gray-600">Hourse Online</p>
            </i>
          </div>
          <div className="text-center">
            <i className="ri-booklet-line font-thin text-3xl mb-2">
              <h5 className="text-lg font-medium">17.6</h5>
              <p className="text-sm text-gray-600">Hourse Online</p>
            </i>
          </div>
        </div>
    </div>
  )
}

export default CaptainDetails
