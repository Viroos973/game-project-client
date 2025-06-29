export const switchTypeCharacteristic = (characteristic) => {
    switch (characteristic) {
        case "PROFESSION":
            return "Профессия"
        case "HEALTH":
            return "Здоровье"
        case "HOBBY":
            return "Хобби"
        case "PHOBIA":
            return "Фобия"
        case "EDUCATION":
            return "Образование"
        case "SKILL":
            return "Навык"
        case "AGE":
            return "Возраст"
        default:
            return "Характеристика"
    }
}