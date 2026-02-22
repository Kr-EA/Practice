import { sum, divide, isAdult, getUser, processNumbers } from "./math";

describe("math utils", () => {

    test("sum returns a number", () => {
        expect(sum(4, 6)).toEqual(expect.any(Number));
    });

    test("divide throws error", () => {
        expect(() => divide(10, 0)).toThrow("Division by zero"); 
    });

    test("isAdult returns true for adult", () => {
        expect(isAdult(20)).toBeTruthy();
    });

    test("isAdult returns false for minor", () => {
        expect(isAdult(15)).toBeFalsy();
    });

    test("processNumbers transforms array", () => {
        expect(processNumbers([1, -2, 3])).toEqual([2, 6]);
    });

    test("array contains value", () => {
        expect(processNumbers([2])).toContain(4);
    });

    test("number greater than", () => {
        expect(sum(10, 5)).toBeGreaterThan(10); 
    });

    test("number less or equal", () => {
        expect(sum(2, 3)).toBeLessThanOrEqual(5);
    });

    test("async function returns object", async () => {
        await expect(getUser(1)).resolves.toMatchObject({ id: 1 });
    });

    test("getUser returns full user object", async () => {
        const user = await getUser(5);

        expect(user).toMatchObject({
            id: 5,
            name: expect.any(String),
        });

        expect(user).toHaveProperty("name");
    });

});


//Разника toBe и toEqual состоит в том, что toBe проверяет ссылочное равенство (аналог ===)
//toEqual проверяет глубоким сравнением, что полезно в случае работы с объектами, массивами и другими составными структурами
//toBe следует использовать для примитивов