export const getDailyTs = (): number => {
    const tsRoundedToDay = new Date();
    tsRoundedToDay.setUTCHours(0, 0, 0, 0);

    return Math.floor(tsRoundedToDay.getTime() / 1000);
}
