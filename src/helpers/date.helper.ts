export function isExpirationDatePassed(expirationDate: string) {
    const currentDate: Date = new Date();
    const expDate: Date = new Date(expirationDate);

    return currentDate > expDate;
}