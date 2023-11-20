type Address = {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface CreateLoyaltyCard {
    fullName: string,
    birthDate: string,
    gender: string,
    address: Address,
    email: string,
    subsidiary: number,
    points?: number,
    verifiedEmail?: boolean,
}
  
export default CreateLoyaltyCard;