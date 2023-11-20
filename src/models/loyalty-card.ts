import CreateLoyaltyCard from "../dtos/create-loyalty-card-dto";

interface LoyaltyCard extends CreateLoyaltyCard {
  id: string,
  verifiedEmail: boolean,
  points: number,
  lastPurchaseDate: string,
  createdAt: string,
  updatedAt: string
}

export default LoyaltyCard;