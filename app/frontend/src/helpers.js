export function formatDollar(price) {
    return `$${price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD`
}