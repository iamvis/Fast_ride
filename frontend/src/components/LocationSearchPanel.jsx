import React from 'react'

const LocationSearchPanel = (props) => {

    //sample array
    const locations =[
        "jshdsjskcosdk opsjkcf jmpoisdcjckjod k pjksjdpjodc",
        "sjhbcdhi  ooliji     sijspj joji jijo   djcjids",
        "sukfhdushfuos oho hoi jijisj dj scji cjisjcsscpj9 ",
        "sopdjj sp9js huuykcfdi ic ijjcjcj   jij cjicj jcidc"

    ]
  return (
    <div>

   {   
    locations.map(function(element ,idx){
       return <div
       key={idx}
       onClick={()=>{
        props.setVehiclePanel(true)
        props.setPanelOpen(false)
       }}
       className=" flex gap-4 items-center my-4 justify-start border-2 p-3 border-gray-50 active:border-black rounded-xl">
        <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full"><i className="ri-map-pin-fill"></i></h2>
        <h4 className="font-medium w-full" >{element}</h4>     
      </div>

    })
    }
    
    </div>
  )
}

export default LocationSearchPanel
