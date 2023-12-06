import CreateLoyaltyCard from "../dtos/create-loyalty-card-dto";
import LoyaltyCard from "../models/loyalty-card";

export const mapperBodyToCreateLoyaltyCardDto = (data: any): CreateLoyaltyCard => {
    const createLoyaltyCard: CreateLoyaltyCard = {
        fullName: data.fullName,
        birthDate: data.birthDate,
        gender: data.gender,
        address: data.address,
        email: data.email,
        subsidiary: data.subsidiary,
        points: data.points ? parseInt(data.points) : 0,
        verifiedEmail: data.verifiedEmail ? data.verifiedEmail === 'true' : false
    };
    return createLoyaltyCard;
}

export const mapperLoyaltyCardDtoToLoyaltyCard = (data: any): LoyaltyCard => {
    return excludeIndexes(data);
}

export const mapperLoyaltyCardsDtoToLoyaltyCard = (data: Record<string, any>[] | undefined): LoyaltyCard[] => {
    return data?.map(excludeIndexes) as LoyaltyCard[];
}

export const mapperIdArrayToCardId = (idArray: number[]): string => {
    return idArray.reduce((acc, digit, index) => {
        const separator = (index % 4 === 0 && index !== 0) ? '-' : '';
        return `${acc}${separator}${digit}`;
    }, '');
}

export const mapperSqsBodyToCreateLoyaltyCardDto = (data: any) => {
    const addressFields = ["zipCode", "country", "state", "city", "street"];
    const addressObject = {} as any;
    
    addressFields.forEach((field: string) => {
        const key = `address/${field}`;
        addressObject[field] = data[key] || '';
        delete data[key];
    });
    
    data.address = addressObject;
    data.verifiedEmail = data.verifiedEmail === 'true';
    data.subsidiary = parseInt(data.subsidiary);
    return mapperBodyToCreateLoyaltyCardDto(data);
}

export const mapperJSONResponse = (statusCode: number, response: any): any => {
    return  {
        statusCode,
        body: JSON.stringify(response),
    }
}

const excludeIndexes = (loyaltyCard: any): LoyaltyCard => {
    const { gsi1pk, gsi1sk, ...loyaltyCardResponse } = loyaltyCard;
    return loyaltyCardResponse as LoyaltyCard;
}

