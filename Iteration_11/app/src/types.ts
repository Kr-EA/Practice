export type Child = {
    name: string,
    age: number,
}
export type User = {
    name: string,
    age: number,
    phone: string,
    email: string,
    children: Array<Child>
}