import React, { useContext } from 'react';
import { fireEvent, render, screen, waitFor} from '@testing-library/react-native'
import { axiosInstance } from '../../api';
import { AuthContext, AuthProvider } from '../../context/AuthContext';
import { Alert } from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper'
import { LiveTrackFooter } from '../LiveTrackFooter';

var trackingInfo = {
    "queue": {
      "relative_position": 2,
      "current_delivery": 1,
      "overall_position": 3,
      "length": 5
    },
    "drone_location": {
      "longitude": -3.1878490000000004,
      "latitude": 55.944623903810566
    },
    "pickups": [
      {
        "id": 2,
        "name": "Greggs",
        "description": "No description provided.",
        "longitude": -3.191257,
        "latitude": 55.945626,
        "image": "/media/images/restaurants/default.png"
      }
    ],
    "delivery_info": {
      "longitude": -3.1888,
      "latitude": 55.9437,
      "status": "CONFIRMED"
    }
  }

  var trackingInfo2 = {
    "queue": {
      "relative_position": 0,
      "current_delivery": 3,
      "overall_position": 3,
      "length": 5
    },
    "drone_location": {
      "longitude": -3.1878490000000004,
      "latitude": 55.944623903810566
    },
    "pickups": [
      {
        "id": 2,
        "name": "Greggs",
        "description": "No description provided.",
        "longitude": -3.191257,
        "latitude": 55.945626,
        "image": "/media/images/restaurants/default.png"
      }
    ],
    "delivery_info": {
      "longitude": -3.1888,
      "latitude": 55.9437,
      "status": "PICKUP"
    }
  }

  var trackingInfo3 = {
    "queue": {
      "relative_position": 0,
      "current_delivery": 3,
      "overall_position": 3,
      "length": 5
    },
    "drone_location": {
      "longitude": -3.1878490000000004,
      "latitude": 55.944623903810566
    },
    "pickups": [
      {
        "id": 2,
        "name": "Greggs",
        "description": "No description provided.",
        "longitude": -3.191257,
        "latitude": 55.945626,
        "image": "/media/images/restaurants/default.png"
      }
    ],
    "delivery_info": {
      "longitude": -3.1888,
      "latitude": 55.9437,
      "status": "DELIVERY"
    }
  }

  var trackingInfo4 = {
    "queue": {
      "relative_position": 0,
      "current_delivery": 3,
      "overall_position": 3,
      "length": 5
    },
    "drone_location": {
      "longitude": -3.1878490000000004,
      "latitude": 55.944623903810566
    },
    "pickups": [
      {
        "id": 2,
        "name": "Greggs",
        "description": "No description provided.",
        "longitude": -3.191257,
        "latitude": 55.945626,
        "image": "/media/images/restaurants/default.png"
      }
    ],
    "delivery_info": {
      "longitude": -3.1888,
      "latitude": 55.9437,
      "status": "DELIVERED"
    }
  }

//mock refresh call
const onRefresh = jest.fn()
const renderComponent = (trackable, info) => {
    return render(
        <LiveTrackFooter title={"Delivery Status"} 
            trackingInfo={info} trackable={trackable} onRefresh={onRefresh}/>
    )
}

it("Nothing should render if untrackable. No footer should appear.", async() => {
    renderComponent(false,trackingInfo)
    await waitFor(() => { 
    expect(screen.queryAllByText("Delivery Queue")).toHaveLength(0)
  })

})

it("If trackable, then main elements outside of messages should be there", async() => {
    renderComponent(true,trackingInfo)
    await waitFor(() => { 
    screen.getByText("Delivery Queue")
    screen.getByText("Refresh")
  })
})

it("Queue message when order is upcoming", async() => {
    renderComponent(true,trackingInfo)
    await waitFor(() => { 
      screen.getByText("Delivery Queue")
        screen.getByText("There are 2 orders infront of you.")
        screen.getByText("Your lunch is delivery 3.")
        screen.getByText("The drone is currently completing delivery 1.")
        screen.getByText("There are 5 orders to deliver today.")
        screen.getByText("Refresh")    
    })
})

it("Queue message when order is heading to pickup", async() => {
    renderComponent(true,trackingInfo2)
    await waitFor(() => { 
      screen.getByText("Delivery Queue")
        screen.getByText("Your order is on its way!")
        screen.getByText("Its status is pickup.")
        screen.getByText("Head outside soon to retrieve it.")
        screen.getByText("Refresh")    
    })
})

it("Queue message when order is delivery order now.", async() => {
    renderComponent(true,trackingInfo3)
    await waitFor(() => { 
      screen.getByText("Delivery Queue")
        screen.getByText("Your order is on its way!")
        screen.getByText("Its status is delivery.")
        screen.getByText("Head outside soon to retrieve it.")
        screen.getByText("Refresh")    
    })
})

it("Order has been completed.", async() => {
    renderComponent(true,trackingInfo3)
    await waitFor(() => { 
      screen.getByText("Delivery Queue")
        screen.getByText("Your order is on its way!")
        screen.getByText("Its status is delivery.")
        screen.getByText("Head outside soon to retrieve it.")
        screen.getByText("Refresh")    
    })
})


it("Pressing refresh should call parent components refresh method", async() => {
    renderComponent(true,trackingInfo3)
    await waitFor(() => { 
        fireEvent.press(screen.getByText("Refresh"))
        expect(onRefresh).toHaveBeenCalled();
    })
})
