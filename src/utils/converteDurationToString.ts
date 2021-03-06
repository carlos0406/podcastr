export default function ConvertDutarionToString(duration: number) {

    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = Math.floor(duration % 60)

    const result = [hours, minutes, seconds].map(unit =>
        String(unit).padStart(2, '0')).join(':');

    return result
}