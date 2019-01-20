export function formatDollar(price) {
    return `${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD`
}

export function isMobileDevice() {
    const isMobile = window.matchMedia("only screen and (max-width: 760px)");
    return isMobile.matches
}