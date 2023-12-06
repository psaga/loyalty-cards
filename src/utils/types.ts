import CreateLoyaltyCard from "../dtos/create-loyalty-card-dto";
import LoyaltyCard from "../models/loyalty-card"

export type FiltersParams = { [name: string]: string | undefined; };

export type GetAllLoyaltyCardsResponse = {
    Items: LoyaltyCard[],
    LastEvaluatedKey?: Record<string, any>
}

export interface ItemLoyaltyCard extends CreateLoyaltyCard {
    id: string,
    gsi1pk: string;
    gsi1sk: string;
    updatedAt: number;
    createdAt: number;
}