import axios from "axios";

export const api = axios.create({
    baseURL: "https://hotel-management-system-1-80d1.onrender.com"
})

export const getHeader=()=>{
    const token=localStorage.getItem("token")
    return{
        Authorization : `Bearer ${token}`,
        "Content-Type":"application/json"
    }
}

export async function addRoom(photo, roomType, roomPrice) {
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("roomType", roomType);
    formData.append("roomPrice", roomPrice);

    const response = await api.post("/rooms/add/new-room", formData, {
        headers: {
            ...getHeader(), // ✅ This adds Authorization and Content-Type
            'Content-Type': 'multipart/form-data' // ✅ override default for FormData
        }
    });

    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}


export async function getRoomTypes() {
    try {
        const response = await api.get("/rooms/types");
        return response.data;
    }
    catch (error) {
        throw new Error("Failed to fetch room types: " + error.message);
    }
}

export async function getAllRooms() {
    try {
        const result = await api.get("/rooms/all-rooms");
        console.log(result);
        return result.data;

    } catch (error) {
        throw new Error("Failed to fetch rooms: " + error.message);
    }
}

export async function deleteRoom(roomId) {
  try {
    const result = await api.delete(`/rooms/delete/room/${roomId}`, {
      headers: getHeader() // ✅ FIXED: now invokes getHeader()
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error deleting room: ${error.message}`);
  }
}


// src/utils/ApiFunctions.js

export async function updateRoom(roomId, formData) {
    const response = await api.put(`/rooms/update/${roomId}`, formData, {
        headers: {
            ...getHeader(), // ✅ Add Authorization header here
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
}



export async function getRoomById(roomId) {
    try {
        const result = await api.get(`/rooms/room/${roomId}`);
        return result.data;
    } catch (error) {
        throw new Error(`Error fetching room ${error.message}`);
    }
}

export async function bookedRoom(roomId, payload) {
  try {
    console.log("Booking payload:", payload);
 
    const response = await api.post(
      `/bookings/room/${roomId}/booking`,
      payload
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error booking room: ${error.message}`);
    }
  }
}

export async function getAllBookings() {
    try {
        const result = await api.get("/bookings/all-bookings");
        return result.data;
    } catch (error) {
        throw new Error(`Error fetching bookings : ${error.message}`);

    }
}

export async function getBookingByConfirmationCode(confirmationCode) {
    try {
        const result = await api.get(`/bookings/confirmation/${confirmationCode}`);
        return result.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error(`Error finding booking: ${error.message}`);
        }
    }
}

export async function cancelBooking(bookingId) {
    try {
        const result = await api.delete(`/bookings/booking/${bookingId}/delete`);
        return result.data;
    } catch (error) {
        throw new Error(`Error cancelling booking: ${error.message}`);
    }
}

export async function availableRooms(checkInDate, checkOutDate) {
    try {
        const response = await api.get("/rooms/available", {
            params: { checkInDate, checkOutDate }
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch available rooms: " + error.message);
    }
}

export async function registerUser(registration) {
	try {
		const response = await api.post("/auth/register-user", registration);
		
		
		const { message, user } = response.data;
        console.log("Registration response:", response.data);
		
		if (user?.token) {
			localStorage.setItem("token", user.token);
			localStorage.setItem("userId", user.id);
			localStorage.setItem("userEmail", user.email);
		}

		return { message, user };
	} catch (error) {
		if (error.response?.data?.error) {
			throw new Error(error.response.data.error);
		}
		throw new Error(`User registration error: ${error.message}`);
	}
}


export async function loginUser(login) {
	try {
		const response = await api.post("/auth/login", login);
		
		const { message, user } = response.data;

		// Store token in localStorage
		if (user?.token) {
			localStorage.setItem("token", user.token);
			localStorage.setItem("userId", user.id);
			localStorage.setItem("userEmail", user.email);
		}
        console.log("Login response:", response.data);
		return { message, user };
	} catch (error) {
		if (error.response?.data?.error) {
			throw new Error(error.response.data.error);  
		}
		throw new Error(`Login error: ${error.message}`);
	}
}


export async function getUserProfile(userId,token){
    try{
        const response=await api.get(`users/profile/${userId}`,{
            headers: getHeader()
        });
        return  response.data;
    }catch(e){
        return e;
    }
}
export async function deleteUser(userId){
    try{
        const response=await api.delete(`/users/delete/${userId}`,{
            headers:getHeader
        })
        return response.data;
    }catch(e){
        return error.message;
    }
}

export async function getUser(userId,token){
    try{
        const response=await api.get(`/users/${userId}`,{
            headers:getHeader()
        })
        return response.data;
    }catch(e){
        throw e;
    }
}

export async function getBookingsByUserId(userId, token) {
	try {
		const response = await api.get(`/bookings/user/${userId}/bookings`, {
			headers: getHeader()
		})
		return response.data
	} catch (error) {
		console.error("Error fetching bookings:", error.message)
		throw new Error("Failed to fetch bookings")
	}
}



export async function requestOtp(email) {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw new Error("Failed to send OTP");
  }
}

export async function verifyOtp(email, otp) {
  try {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    throw new Error("OTP verification failed");
  }
}

export async function resetPassword(email, newPassword) {
  try {
    const response = await api.post("/auth/reset-password", { email, newPassword });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error.message);
    throw new Error("Password reset failed");
  }
}

export async function changePassword(email, oldPassword, newPassword) {
  try {
    const response = await api.post(
      "/auth/change-password",
      { email, oldPassword, newPassword },
      { headers: getHeader() }
    );
    return response.data;       
  } catch (error) {
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error("Password change failed");
  }
}
