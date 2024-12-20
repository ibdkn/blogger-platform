export function isExpirationDatePassed(expirationDate) {
    const currentDate = new Date();
    const expDate = new Date(expirationDate);

    return currentDate > expDate;
}