export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
};

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN');
};

export const formatPhone = (phone: string): string => {
    return phone.replace(/(\d{5})(\d{5})/, '$1-$2');
};
