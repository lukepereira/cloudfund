export const UIActionTypes = Object.freeze({
    SIDE_MENU_TOGGLE: 'SIDE_MENU_TOGGLE',
    SIDE_MENU_OPEN: 'SIDE_MENU_OPEN',
    SIDE_MENU_CLOSE: 'SIDE_MENU_CLOSE',
})

export const toggleSideMenu = () => {
    return {type: UIActionTypes.SIDE_MENU_TOGGLE}
} 

export const openSideMenu = () => {
    return {type: UIActionTypes.SIDE_MENU_OPEN}
} 

export const closeSideMenu = () => {
    return {type: UIActionTypes.SIDE_MENU_CLOSE}
} 