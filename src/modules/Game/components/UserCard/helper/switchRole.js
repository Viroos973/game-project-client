export const switchRole = (role) => {
    switch(role) {
        case "DWELLER":
            return "Житель"
        case "LEADER":
            return "Лидер"
        case "MEMBER_SENATE":
            return "Член сената"
        case "EXPELLED":
            return "Изгнанный"
        default:
            return "Роль"
    }
}