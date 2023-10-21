interface Setting {
    image: string;
    name: string;
}
interface Settings {
    id: string;
    data: Setting;
}

export { Setting, Settings };