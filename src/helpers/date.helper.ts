export function isExpirationDatePassed(expirationDate: string) {
    const currentDate = new Date();
    const expDate = new Date(expirationDate);

    return currentDate > expDate;
}