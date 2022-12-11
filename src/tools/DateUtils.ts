export const getDate = (timestamp?: number) => {
    return timestamp ? new Date(timestamp) : new Date();
};

export const getDayName = (timestamp: number) => {
    const date = getDate(timestamp);
    return date.toLocaleDateString('fr', { weekday: 'long' });
}

export const getDateString = (timestamp?: number) => {
    const date = getDate(timestamp);
    const monthString = date.getMonth()+1+'';
    const dayString = date.getDate()+'';
    return `${dayString.padStart(2, '0')}/${monthString.padStart(2, '0')}/${date.getFullYear()}`;
};

export const getDateTimeString = (timestamp?: number) => {
    const date = getDate(timestamp);
    const hours = date.getHours()+'';
    const minutes = date.getMinutes()+'';
    const seconds = date.getSeconds()+'';
    return `${getDateString(timestamp)} ${hours.padStart(2, '0')}h${minutes.padStart(2, '0')} ${seconds.padStart(2, '0')}s`;
};

export const parseDate = (input: string) => {
    return getDate(Date.parse(input));
};

export const addDays = (date: Date, days: number) => {
    const result = new Date(date.getTime());
    return result.setDate(result.getDate() + days);
}

export const getDateStringForInput = (date: Date) => {
    const monthString = date.getMonth()+1+'';
    const dayString = date.getDate()+'';
    return `${date.getFullYear()}-${monthString.padStart(2, '0')}-${dayString.padStart(2, '0')}`;
};
