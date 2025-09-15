export const toDate = (timestamp: { _seconds: number; _nanoseconds: number }) => {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};

export const formatTime = (timestamp: any) => {
    const date = toDate(timestamp);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
};