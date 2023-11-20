import LoyaltyCard from "../models/loyalty-card"

export type FiltersParams = { [name: string]: string | undefined; };

export type GetAllLoyaltyCardsResponse = {
    Items: LoyaltyCard[],
    LastEvaluatedKey?: Record<string, any>
}