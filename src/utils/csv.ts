import * as Papa from 'papaparse';

export const parseCSV = (str: string) => {
    const parsed = Papa.parse(str, {
        header: true
    }).data;

    return parsed.filter((elem: any) => elem.fullName && elem.email);
}